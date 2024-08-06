from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, get_db
from app.db.models import SlackUserInfo, DailyReport, TimesTweet, TimesList
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
SIGNING_SECRET = os.getenv("SIGNING_SECRET")

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

# Slack APIからtimesチャンネルの投稿情報を取得し、Postgresに保存する関数
def get_and_save_times_tweet(event, db: Session):

    conversation_history = []
    channel_id = event.get('channel')  # イベントからチャンネルIDを取得
    print(channel_id)

    if not channel_id:
        logger.error("Channel ID is missing in the event data")
        raise HTTPException(status_code=400, detail="Channel ID is missing")

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
            message_record = TimesTweet(ts=ts, user_id=user_id, text=text, channel_id=channel_id)
            db.merge(message_record)  # 存在する場合は更新し、存在しない場合は挿入
            logger.debug(f"Message {id} merged: ts={ts}, user_id={user_id}")

            # スレッドのリプライを取得
            if 'thread_ts' in message:
                thread_ts = message['thread_ts']
                replies_result = slack_client.conversations_replies(channel=channel_id, ts=message['thread_ts'])
                replies = replies_result['messages']

                for reply in replies:
                    reply_ts = reply.get('ts')
                    reply_user_id = reply.get('user')
                    reply_text = reply.get('text')
                    parent_user_id = reply.get('parent_user_id')

                    reply_record = TimesTweet(
                        ts=reply_ts,
                        user_id=reply_user_id,
                        text=reply_text,
                        channel_id=channel_id,
                        thread_ts=thread_ts,
                        parent_user_id=parent_user_id
                    )
                    db.merge(reply_record)  # 存在する場合は更新し、存在しない場合は挿入
                    logger.debug(f"Reply merged: ts={reply_ts}, user_id={reply_user_id}")
        
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

