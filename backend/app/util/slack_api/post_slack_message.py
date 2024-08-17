from app.db.database import get_db, SessionLocal
from app.db.models import Employee
from sqlalchemy.orm import Session
from app.db.models import Question, Employee
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from slackeventsapi import SlackEventAdapter
import os
from dotenv import load_dotenv
import logging

# .envファイルから環境変数を読み込む
load_dotenv()

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")
SIGNING_SECRET = os.getenv("SIGNING_SECRET")
# Slackクライアントの設定
client = WebClient(token=SLACK_TOKEN)
slack_events_adapter = SlackEventAdapter(SIGNING_SECRET, "/slack/events")

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Slackでdaily_reportチャンネルにテキストメッセージを送る(シーディング用)
def send_message_to_daily_report():
    try:
        # Call the chat.postMessage method using the WebClient
        result = client.chat_postMessage(
            channel=os.getenv("DAILY_REPORT_CHANNEL_ID"),
            text="setting message"
        )
        logger.info(result)
    except SlackApiError as e:
        logger.error(f"Error posting message: {e}")

# Slackでslack_user_id指定でテキストメッセージを送る(シーディング用)
def send_message_to_user():
    try:
        sayoko_times_channel = os.getenv("SLACK_MY_TIMES_CHANNEL")
        result = client.chat_postMessage(
            channel=sayoko_times_channel,
            text="setting message"
        )
        logger.info(result)
    except SlackApiError as e:
        logger.error(f"Error sending message: {e.response['error']}")

send_message_to_daily_report()
send_message_to_user()