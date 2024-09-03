import logging
import os
from dotenv import load_dotenv
from fastapi import HTTPException
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

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

# Slack APIでメールアドレスからSlackユーザーIDを検索する関数(エンドポイントテスト確認済)
async def get_slack_user_id_by_email(email: str):
    logger.info(f"◆◆get_slack_user_id_by_email関数が呼び出されました")
    try:
        # Slack APIを呼び出してユーザー情報を取得
        response = slack_client.users_lookupByEmail(email=email)

        # SlackユーザーIDを取得
        slack_user_id = response['user']['id']
        logger.info(f"◆◆SlackユーザーID '{slack_user_id}' がメール '{email}' から取得されました。")

        # SlackユーザーIDをレスポンスとして返す
        return {"email": email, "slack_user_id": slack_user_id}

    except SlackApiError as e:
        # Slack APIエラーの処理
        logger.error(f"◆◆Slack APIエラー: {e.response['error']}")
        raise HTTPException(status_code=400, detail=f"◆◆Slackユーザーの取得に失敗しました: {e.response['error']}")

    except Exception as e:
        # その他のエラー処理
        logger.error(f"予期しないエラー: {str(e)}")
        raise HTTPException(status_code=500, detail="◆◆予期しないエラーが発生しました")