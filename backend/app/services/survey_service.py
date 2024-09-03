import logging
import os
import json
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.util.career_survey.send_survey_to_all import send_survey_to_employee, send_survey_with_text_input
from app.util.career_survey.survey_responses_with_cache import save_responses_to_db,store_user_response_temporarily
from app.util.career_survey.question_cache import clear_question_cache, deserialize_question
from app.util.survey_analysis.save_analysis_result import save_survey_result
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from app.db.database import get_db
from app.db.models import Question
from app.services.redis_client import redis_client

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
# slack_sdkライブラリのログレベルをINFOに設定
logging.getLogger("slack_sdk").setLevel(logging.INFO)

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")
SIGNING_SECRET = os.getenv("SIGNING_SECRET")
slack_client = WebClient(token=SLACK_TOKEN)

# Slackキャリアアンケートの配信ロジック
# Slackでのインタラクションを処理し、ユーザーの回答を保存して次の質問を送信します
# 引数:request (Request): FastAPIのリクエストオブジェクト
#     db (Session): SQLAlchemyのデータベースセッションオブジェクト
# 戻り値: status_code: 200 or 500
async def handle_slack_interactions(request: Request, db: Session = Depends(get_db)):
    logger.debug("◆◆キャリアアンケートのエンドポイントにリクエストが送られました")
    try:
        # リクエストのフォームデータを取得
        body = await request.form()
        payload = json.loads(body["payload"])  # json.loads() を使用するために json モジュールをインポート
        logger.debug(f"Payload: {payload}")

        user_id = payload["user"]["id"]
        actions = payload["actions"]
        block_id = actions[0]["value"]
        free_text = None

        # block_id と callback_id の両方に対応する
        if "block_id" in actions[0]:
            question_id = int(actions[0]["value"])
        elif "callback_id" in payload:
            question_id = int(payload["callback_id"])
        else:
            raise ValueError("◆◆block_id または callback_id がペイロードに見つかりません")

        # ユーザーの選択した値を取得
        # 自由記述が含まれている場合、送信ボタンクリックをトリガーに値を取得（ free_text )
        selected_option = None
        if "block_id" in actions[0]:
            actions[0]["text"]["text"] == "送信"
            free_text = payload['state']['values'].get(block_id, {}).get('free_text_input', {}).get('value')
            logger.info(f"◆◆SlackユーザーID {user_id} が自由記述を送信しました: {free_text}")
        else:
            selected_option = actions[0]["value"]
            logger.info(f"◆◆ {user_id} が選択ボタンを押しました: {selected_option}")

        if selected_option is None and free_text is None:
            logger.warning(f"◆◆ {user_id} が自由記述を空白にして送信しましたが、次の質問へ遷移します")
            free_text = ""  # 空の自由記述でも進めるように空文字を設定

        store_user_response_temporarily(user_id, question_id, free_text or selected_option)

        # 質問キャッシュクリアを追加
        clear_question_cache(question_id)

        # エラーハンドリング
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(status_code=404, detail="質問が見つかりません")
        # 次の質問を取得して送信（Redisキャッシュ対応）
        next_question_id = None
        # 次の質問のIDを決定する
        # ユーザーが選択肢（例えば、A, B, C, D）のいずれかを選んだ場合、その選択肢に応じて次の質問IDを決定
        if selected_option:
            if selected_option == 'A':
                next_question_id = question.next_question_a_id
            elif selected_option == 'B':
                next_question_id = question.next_question_b_id
            elif selected_option == 'C':
                next_question_id = question.next_question_c_id
            elif selected_option == 'D':
                next_question_id = question.next_question_d_id
        # free_text が入力された場合（自由記述を行った場合）、次の質問として next_question_a_id に設定されたIDを使用
        elif free_text:
            next_question_id = question.next_question_a_id
        # アンケート終了時の処理
        if not next_question_id:
            slack_client.chat_postMessage(channel=user_id, text="アンケートの回答を送信しました！ご回答ありがとうございました。")
            logger.info(f"◆◆SlackユーザーID {user_id} のアンケートが完了しました")
            save_responses_to_db(user_id, db)
            # LLMによるアンケートの分析結果を保存する関数
            save_survey_result(user_id, db)
            # キャッシュクリア
            clear_question_cache(question_id)
        else:
            # Redisで次の質問をキャッシュから取得
            next_question_key = f"question:{next_question_id}"
            cached_question = redis_client.get(next_question_key)

            if cached_question:
                logger.info(f"◆◆質問ID {next_question_id} のキャッシュヒット")
                # キャッシュから質問を取得し、デシリアライズ
                next_question = deserialize_question(cached_question)
            else:
                logger.info(f"◆◆質問ID {next_question_id} のキャッシュミス、データベースから取得します")
                # キャッシュにない場合はデータベースから取得
                next_question = db.query(Question).filter(Question.id == next_question_id).first()

            # 質問をSlackに送信
            if next_question.choice_a == "自由記述":
                send_survey_with_text_input(user_id, next_question)
            else:
                send_survey_to_employee(user_id, next_question)

        return Response(status_code=200)

    except Exception as e:
        logger.error(f"◆◆リクエスト処理中にエラーが発生しました: {e}")
        raise HTTPException(status_code=500, detail="◆◆内部サーバーエラー")