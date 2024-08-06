from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, get_db
from app.db.models import SlackUserInfo, DailyReport
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from slackeventsapi import SlackEventAdapter
from dotenv import load_dotenv
import os
import logging

# .envファイルから環境変数を読み込む
load_dotenv()

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")
SIGNING_SECRET = os.getenv('SIGNING_SECRET')

# Slackクライアントの設定
slack_client = WebClient(token=SLACK_TOKEN)
slack_events_adapter = SlackEventAdapter(SIGNING_SECRET, "/slack/events")

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Slack APIからユーザー情報を取得し、Postgresに保存する関数
def get_and_save_users(db: Session):
    try:
        # users.listメソッドを使用してユーザー情報を取得
        result = slack_client.users_list()
        users_array = result["members"]

        # 結果をログに出力
        logger.info("{} users found".format(len(users_array)))

        for user in users_array:
            user_id = user["id"]
            user_name = user.get("name")
            real_name = user.get("real_name")

            # ユーザー情報をデータベースに挿入
            user_record = SlackUserInfo(id=user_id, name=user_name, real_name=real_name)
            db.merge(user_record)  # 存在する場合は更新し、存在しない場合は挿入
        
        # コミットして変更を保存
        db.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        return {"error": str(e)}
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        db.rollback()  # エラーが発生した場合、ロールバック

    finally:
        db.close()  # 最後にセッションを閉じる

    return {"status": "success"}

# Slack APIからdaily_reportチャンネルの投稿情報を取得し、Postgresに保存する関数
def get_and_save_daily_report(event, db: Session):

    conversation_history = []
    channel_id = os.getenv("DAILY_REPORT_CHANNEL_ID")

    try:
        # 先にユーザー情報を保存
        get_and_save_users(db)

        # conversations.historyメソッドを使用してチャンネルのメッセージを取得
        result = slack_client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]
        logger.debug("Conversations history retrieved")

        # 結果をログに出力
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))

        for message in conversation_history:
            ts = message.get('ts')
            user_id = message.get('user')
            text = message.get('text')

            # ユーザー情報をデータベースに挿入
            message_record = DailyReport(ts=ts, user_id=user_id, text=text)
            db.merge(message_record)  # 存在する場合は更新し、存在しない場合は挿入
            logger.debug(f"Message {id} merged: ts={ts}, user_id={user_id}")
        
        # コミットして変更を保存
        db.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        db.rollback()  # エラーが発生した場合、ロールバック
        raise HTTPException(status_code=500, detail="Database error")

    return {"status": "success"}