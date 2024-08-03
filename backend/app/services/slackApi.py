import os
from fastapi import FastAPI
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv
import logging

# 環境変数をロード
load_dotenv()

# APIキーを設定
api_key = os.getenv("SLACK_API_KEY")

# WebClientを定義
client = WebClient(token=api_key)

# ロガーを設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# conversation_historyメソッド
def get_conversation_history():
    conversation_history = []
    # ID of the channel you want to send the message to
    channel_id = os.getenv("DAILY_REPORT_CHANNEL_ID")

    try:
        # Call the conversations.history method using the WebClient
        # conversations.history returns the first 100 messages by default
        # These results are paginated, see: https://api.slack.com/methods/conversations.history$pagination
        result = client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]

        # Print results
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))

    except SlackApiError as e:
        logger.error("Error creating conversation: {}".format(e))
    
    return {"messages": conversation_history}