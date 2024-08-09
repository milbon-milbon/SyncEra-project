import logging
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.services.slackApi import get_and_save_users, get_and_save_daily_report, get_and_save_times_tweet
from slack_sdk import WebClient
from app.db.database import get_db
from app.db.models import DailyReport
from app.routers import frontend_requests, slack_requests, career_survey

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

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

# FastAPIアプリケーションにルーターを登録
app.include_router(router)