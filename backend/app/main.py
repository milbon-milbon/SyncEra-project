import logging
import os
import json
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
# backend/app/main.py
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from app.services.slackApi import get_and_save_daily_report, get_and_save_times_tweet
from app.util.slack_api.get_slack_user_info import get_and_save_slack_users
from app.util.career_survey.send_survey_to_all import send_survey_to_employee, send_survey_with_text_input
from app.services.schedule_survey import schedule_hourly_survey, schedule_monthly_survey
from app.util.career_survey.question_cache import clear_question_cache, deserialize_question, serialize_question
from app.util.survey_analysis.save_analysis_result import save_survey_result
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from slack_sdk.errors import SlackApiError
from app.db.database import get_db
from app.db.models import Question, UserResponse
from app.routers import frontend_requests
from app.db import schemas
from fastapi.responses import JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler
# めめ追加 : redis用のimport
from redis import Redis

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# めめ追加 : redisの接続設定
REDIS_HOST = os.getenv("REDIS_HOST", "redis") # "redis"部分はコンテナでの開発時。ローカルの時はlocalhost
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT)

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")
SIGNING_SECRET = os.getenv("SIGNING_SECRET")

# つぶやきチャンネルのIDを環境変数から読み込む
TWEET_CHANNEL_IDS = os.getenv("TWEET_CHANNEL_IDS", "").split(",")
slack_client = WebClient(token=SLACK_TOKEN)
from app.services.stripe import router as stripe_router

app = FastAPI()

origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  #デプロイ前に要確認、今は "*" でOK
    allow_headers=["*"],  #デプロイ前に要確認、今は "*" でOK
)

# ルーターの定義
router = APIRouter()

app.include_router(frontend_requests.router, prefix="/client", tags=["client"])

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."

# slackのユーザーアイコン情報取得を確認するためのエンドポイント
@app.get("/slack_users/")
def get_slack_user_info(db: Session = Depends(get_db)):
    return get_and_save_slack_users(db)

# Slack APIでメールアドレスからSlack IDを取得するエンドポイント
@app.post("/get_slack_user_id/")
async def get_slack_user_id(email: str):

    try:
        # Slack APIを呼び出してユーザー情報を取得
        response = slack_client.users_lookupByEmail(email=email)

        # SlackユーザーIDを取得
        slack_user_id = response['user']['id']
        logger.info(f"SlackユーザーID '{slack_user_id}' がメール '{email}' から取得されました。")

        # SlackユーザーIDをレスポンスとして返す
        return {"email": email, "slack_user_id": slack_user_id}

    except SlackApiError as e:
        # Slack APIエラーの処理
        logger.error(f"Slack APIエラー: {e.response['error']}")
        raise HTTPException(status_code=400, detail=f"Slackユーザーの取得に失敗しました: {e.response['error']}")

    except Exception as e:
        # その他のエラー処理
        logger.error(f"予期しないエラー: {str(e)}")
        raise HTTPException(status_code=500, detail="予期しないエラーが発生しました")

# 日報の投稿情報の取得を確認するためのエンドポイント
@app.get("/post_daily_report")
def read_daily_report(db: Session = Depends(get_db)):
    return get_and_save_daily_report(None, db)

# Slackイベントのエンドポイント
# 日報または、つぶやきが投稿されたときに、投稿内容を取得してDB保存するためのエンドポイント
# 日報または、つぶやきが投稿されたときに、投稿内容を取得してDB保存するためのエンドポイント
@app.post("/slack/events")
async def slack_events(request: Request, db: Session = Depends(get_db)):
    try:
        payload = await request.json()
        logger.debug(f"Payload: {payload}")

        # SlackのURL検証のためのチャレンジリクエストに対応
        if "challenge" in payload:
            return {"challenge": payload["challenge"]}


        # イベント処理
        event = payload.get("event", {})
        if event.get("type") == "message" and "subtype" not in event:
            channel_id = event.get("channel")
            if channel_id in TWEET_CHANNEL_IDS:
                return get_and_save_times_tweet(event, db)
            if channel_id == os.getenv("DAILY_REPORT_CHANNEL_ID"):
                return get_and_save_daily_report(event, db)

        return {"status": "ignored"}
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Slackでキャリアアンケート送信のためのエンドポイント
# Slackでのインタラクションを処理し、ユーザーの回答を保存して次の質問を送信します
# 引数:request (Request): FastAPIのリクエストオブジェクト
#     db (Session): SQLAlchemyのデータベースセッションオブジェクト
# 戻り値: status_code: 200 or 500

@app.post("/slack/actions")
async def handle_slack_interactions(request: Request, db: Session = Depends(get_db)):
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
            raise ValueError("Neither block_id nor callback_id found in payload")

        # ユーザーの選択した値を取得
        # 自由記述が含まれている場合、送信ボタンクリックをトリガーに値を取得（ free_text )
        selected_option = None
        if "block_id" in actions[0]:
            actions[0]["text"]["text"] == "送信"
            free_text = payload['state']['values'].get(block_id, {}).get('free_text_input', {}).get('value')
            logger.info(f"User {user_id} submitted free text: {free_text}")
        else:
            selected_option = actions[0]["value"]
            logger.info(f"User {user_id} submitted the survey with option {selected_option}")

        if selected_option is None and free_text is None:
            logger.warning(f"No valid option or free text provided by user {user_id}. Proceeding with next question.")
            free_text = ""  # 空の自由記述でも進めるように空文字を設定

        # 回答をDBに保存
        response_data = UserResponse(
            slack_user_id=user_id,
            question_id=question_id,
            answer=selected_option,
            free_text=free_text
        )
        # 回答をDBに保存
        db.add(response_data)
        db.commit()
        logger.info(f"Response saved for user {user_id} for question {question_id}")
        # キャッシュクリアを追加
        clear_question_cache(question_id)

        # エラーハンドリング
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
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
            logger.info(f"Survey completed for user {user_id}")
            # LLMによるアンケートの分析結果を保存する関数
            save_survey_result(user_id, db)
            # キャッシュクリアを追加
            clear_question_cache(question_id)
        else:
            # Redisで次の質問をキャッシュから取得
            next_question_key = f"question:{next_question_id}"
            cached_question = redis_client.get(next_question_key)

            if cached_question:
                logger.info(f"Cache hit for question {next_question_id}")
                # キャッシュから質問を取得し、デシリアライズ
                next_question = deserialize_question(cached_question)
            else:
                logger.info(f"Cache miss for question {next_question_id}, retrieving from database")
                # キャッシュにない場合はデータベースから取得
                next_question = db.query(Question).filter(Question.id == next_question_id).first()

            # 質問をSlackに送信
            if next_question.choice_a == "自由記述":
                send_survey_with_text_input(user_id, next_question)
            else:
                send_survey_to_employee(user_id, next_question)

        return Response(status_code=200)

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# スケジュールを FastAPI のスタートアップイベントで開始
@app.on_event("startup")
async def start_scheduler():
    # schedule_hourly_survey()
    schedule_monthly_survey()

# FastAPIアプリケーションにルーターを登録
app.include_router(router)
# Stripeのルーターを登録
app.include_router(stripe_router)