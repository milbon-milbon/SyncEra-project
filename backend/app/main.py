import logging
import os
import json
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.services.slack_event import get_and_save_daily_report, get_and_save_times_tweet
from app.util.slack_api.get_slack_user_info import get_and_save_slack_users
from app.services.survey_service import handle_slack_interactions
# from app.util.career_survey.send_survey_to_all import send_survey_to_employee, send_survey_with_text_input
from app.util.slack_api.get_slack_user_id_with_email import get_slack_user_id_by_email
from app.services.schedule_survey import schedule_monthly_survey, schedule_hourly_survey
# from app.util.career_survey.question_cache import clear_question_cache, deserialize_question
from app.util.survey_analysis.save_analysis_result import save_survey_result
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from app.db.database import get_db
from app.db.models import Question, UserResponse
from app.routers import frontend_requests
# from redis import Redis
from app.services.redis_client import redis_client

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
# slack_sdkライブラリのログレベルをINFOに設定
logging.getLogger("slack_sdk").setLevel(logging.INFO)

# redisの接続設定
# REDIS_HOST = os.getenv("REDIS_HOST", "redis")
# REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
# redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT)

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
        return await get_slack_user_id_by_email(email)

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 日報の投稿情報の取得を確認するためのエンドポイント
@app.get("/post_daily_report")
def read_daily_report(db: Session = Depends(get_db)):
    return get_and_save_daily_report(None, db)

# Slackイベントのエンドポイント
# 日報または、つぶやきが投稿されたときに、投稿内容を取得してDB保存するためのエンドポイント
@app.post("/slack/events")
async def slack_events(request: Request, db: Session = Depends(get_db)):
    logger.debug("◆◆Slackイベントのエンドポイントにリクエストが送られました")
    try:
        payload = await request.json()
        logger.debug(f"Payload: {payload}")

        # SlackのURL検証のためのチャレンジリクエストに対応
        if "challenge" in payload:
            logger.debug("◆◆Slackのチャレンジリクエストを処理中")
            return {"challenge": payload["challenge"]}


        # イベント処理
        event = payload.get("event", {})
        if event.get("type") == "message" and "subtype" not in event:
            logger.debug("◆◆Slackイベントが発生しました")
            channel_id = event.get("channel")
            if channel_id in TWEET_CHANNEL_IDS:
                logger.debug("◆◆ツイートチャンネルのイベントを処理中")
                return get_and_save_times_tweet(event, db)
            if channel_id == os.getenv("DAILY_REPORT_CHANNEL_ID"):
                logger.debug("◆◆日報チャンネルのイベントを処理中")
                return get_and_save_daily_report(event, db)

        return {"status": "ignored"}
    except Exception as e:
        logger.error(f"◆◆リクエスト処理中にエラーが発生しました: {e}")
        raise HTTPException(status_code=500, detail="予期しないエラーが発生しました")

# Slackでキャリアアンケート送信のためのエンドポイント
# Slackでのインタラクションを処理し、ユーザーの回答を保存して次の質問を送信します
# 引数:request (Request): FastAPIのリクエストオブジェクト
#     db (Session): SQLAlchemyのデータベースセッションオブジェクト
# 戻り値: status_code: 200 or 500

@app.post("/slack/actions")
async def slack_actions(request: Request, db: Session = Depends(get_db)):
    return await handle_slack_interactions(request, db)

# スケジュールを FastAPI のスタートアップイベントで開始
@app.on_event("startup")
async def start_scheduler():
    schedule_hourly_survey()
    schedule_monthly_survey()
    # schedule_daily_report_save_to_db()

# FastAPIアプリケーションにルーターを登録
app.include_router(router)
# Stripeのルーターを登録
app.include_router(stripe_router)