from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os

# あくまでSlackにBotからメッセージを送信するだけのロジックであり
# この関数だけではアンケートの配信はできない

slack_token = os.getenv("SLACK_API_KEY")
client = WebClient(token=slack_token)

def send_message(user_id: str, text: str):
    try:
        response = client.chat_postMessage(channel=user_id, text=text)
    except SlackApiError as e:
        print(f"Error sending message: {e.response['error']}")
