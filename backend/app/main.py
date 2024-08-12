import logging
import os
import json
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.services.slackApi import get_and_save_users, get_and_save_daily_report, get_and_save_times_tweet
from app.util.career_survey.send_survey_to_all import send_survey_to_employee
from app.services.schedule_survey import schedule_hourly_survey, schedule_monthly_survey
from slack_sdk import WebClient
from app.db.database import get_db
from app.db.models import DailyReport, Question, Response
from app.routers import frontend_requests, slack_requests, career_survey
from app.db import schemas
from fastapi.responses import JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")
SIGNING_SECRET = os.getenv("SIGNING_SECRET")
# つぶやきチャンネルのIDを環境変数から読み込む
TWEET_CHANNEL_IDS = os.getenv("TWEET_CHANNEL_IDS", "").split(",")
slack_client = WebClient(token=SLACK_TOKEN)

app = FastAPI()

#マージの時残してください めめ
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

#マージの時残してください　めめ
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
app.include_router(slack_requests.router, prefix="/slack", tags=["slack"])
app.include_router(career_survey.router, prefix="/survey", tags=["survey"])

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."

# slackのユーザー情報取得を確認するためのエンドポイント
@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    return get_and_save_users(db)

# 日報の投稿情報の取得を確認するためのエンドポイント
@app.get("/post_daily_report")
def read_daily_report(db: Session = Depends(get_db)):
    return get_and_save_daily_report(None, db)

# Slackイベントのエンドポイント
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
# Slackでのインタラクションを処理し、ユーザーの回答を保存して次の質問を送信します。
# 引数:request (Request): FastAPIのリクエストオブジェクト。
#     db (Session): SQLAlchemyのデータベースセッションオブジェクト。
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
        print(actions)
        question_id = int(payload["callback_id"])

        # ユーザーの選択した値を取得
        selected_option = actions[0]["value"]
        logger.info(f"User {user_id} submitted the survey with option {selected_option}")

        # selected_optionが未設定の場合のエラー処理
        if selected_option is None:
            raise ValueError("No valid option was selected by the user.")

        # 回答をDBに保存
        response_data = Response(
            slack_user_id=user_id,
            question_id=question_id,
            answer=selected_option,

        )
       # 回答をDBに保存し、次の質問を取得して送信
        db.add(response_data)
        db.commit()
        logger.info(f"Response saved for user {user_id} for question {question_id}")

        # 次の質問を取得して送信
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        next_question_id = None
        if selected_option == 'A':
            next_question_id = question.next_question_a_id
        elif selected_option == 'B':
            next_question_id = question.next_question_b_id
        elif selected_option == 'C':
            next_question_id = question.next_question_c_id
        elif selected_option == 'D':
            next_question_id = question.next_question_d_id

        if not next_question_id:
            slack_client.chat_postMessage(channel=user_id, text="アンケートの回答を送信しました！ご回答ありがとうございました。")
            logger.info(f"Survey completed for user {user_id}")
        else:
            next_question = db.query(Question).filter(Question.id == next_question_id).first()
            send_survey_to_employee(user_id, next_question)
            logger.info(f"Next question sent to user {user_id}")

        return Response(status_code=200)

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# スケジュールを FastAPI のスタートアップイベントで開始
@app.on_event("startup")
async def start_scheduler():
    schedule_hourly_survey()
    schedule_monthly_survey()

# FastAPIアプリケーションにルーターを登録
app.include_router(router)