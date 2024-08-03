from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv
import os
import logging

# .envファイルから環境変数を読み込む
load_dotenv()

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")

# WebClientを定義
client = WebClient(token=SLACK_TOKEN)

# ロガーを設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_daily_report():
    conversation_history = []
    channel_id = "C07F5D3LDHB"

    try:
        # conversations.historyメソッドを使用してチャンネルのメッセージを取得
        result = client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]

        # 結果をログに出力
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))
        
    except SlackApiError as e:
        logger.error("Error fetching conversation history: {}".format(e))
        return {"error": str(e)}

    return {"messages": conversation_history}
