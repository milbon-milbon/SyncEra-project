from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, get_db
from app.db.models import DailyReport, TimesTweet
from app.util.slack_api.get_slack_user_info import get_and_save_slack_users
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

# Slack APIからdaily_reportチャンネルの投稿情報を取得し、Postgresに保存する関数
def get_and_save_daily_report(event, db: Session):

    conversation_history = []
    channel_id = os.getenv("DAILY_REPORT_CHANNEL_ID")
    excluded_user_id = os.getenv("EXCLUDED_USER_ID")  # 環境変数から除外するユーザーIDを取得

    try:
        # 先にユーザー情報を保存
        get_and_save_slack_users(db)

        # conversations.historyメソッドを使用してチャンネルのメッセージを取得
        result = slack_client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]
        logger.debug("Conversations history retrieved")

        # 結果をログに出力
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))

        for message in conversation_history:
            # subtypeがchannel_joinの場合はスキップ
            if message.get('subtype') == 'channel_join':
                continue

            ts = message.get('ts')
            user_id = message.get('user')
            text = message.get('text')

            # 環境変数で設定されたユーザーIDの投稿をスキップ
            if user_id == excluded_user_id:
                logger.info(f"Skipping message from user {user_id}")
                continue

            # メッセージが存在するかをチェック
            existing_message = db.query(DailyReport).filter_by(ts=ts).first()
            if existing_message:
                # メッセージが存在する場合、内容を更新
                existing_message.text = text
                logger.debug(f"Message updated: ts={ts}, user_id={user_id}")
            else:
                # メッセージが存在しない場合、新規に追加
                message_record = DailyReport(ts=ts, user_id=user_id, text=text) #user_id => slack_user_idにする(meme)
                db.add(message_record)
                logger.debug(f"Message added: ts={ts}, user_id={user_id}")
        
        # コミットして変更を保存
        db.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        db.rollback()  # エラーが発生した場合、ロールバック
        raise HTTPException(status_code=500, detail="Database error")

    return {"status": conversation_history}

# Slack APIからtimesチャンネルの投稿情報を取得し、Postgresに保存する関数
def get_and_save_times_tweet(event, db: Session):

    conversation_history = []
    channel_id = event.get('channel')  # イベントからチャンネルIDを取得
    excluded_user_id = os.getenv("EXCLUDED_USER_ID")  # 環境変数から除外するユーザーIDを取得

    if not channel_id:
        logger.error("Channel ID is missing in the event data")
        raise HTTPException(status_code=400, detail="Channel ID is missing")

    try:
        # 先にユーザー情報を保存
        get_and_save_slack_users(db)

        # conversations.historyメソッドを使用してチャンネルのメッセージを取得
        result = slack_client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]
        logger.debug("Conversations history retrieved")

        # 結果をログに出力
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))

        for message in conversation_history:
            # subtypeがchannel_joinの場合はスキップ
            if message.get('subtype') == 'channel_join':
                continue

            ts = message.get('ts')
            user_id = message.get('user')
            text = message.get('text')

            # 環境変数で設定されたユーザーIDの投稿をスキップ
            if user_id == excluded_user_id:
                logger.info(f"Skipping message from user {user_id}")
                continue

            # メッセージが存在するかをチェック
            existing_message = db.query(TimesTweet).filter_by(ts=ts).first()
            if existing_message:
                # メッセージが存在する場合、内容を更新
                existing_message.text = text
                logger.debug(f"Message updated: ts={ts}, user_id={user_id}")
            else:
                # メッセージが存在しない場合、新規に追加
                message_record = TimesTweet(ts=ts, user_id=user_id, text=text, channel_id=channel_id) # user_id => slack_user_idにする(meme)
                db.add(message_record)
                logger.debug(f"Message added: ts={ts}, user_id={user_id}")

            # スレッドのリプライを取得
            if 'thread_ts' in message:
                thread_ts = message['thread_ts']
                replies_result = slack_client.conversations_replies(channel=channel_id, ts=message['thread_ts'])
                replies = replies_result['messages']

                for reply in replies:
                    # subtypeがchannel_joinの場合はスキップ
                    if reply.get('subtype') == 'channel_join':
                        continue

                    reply_ts = reply.get('ts')
                    reply_user_id = reply.get('user')
                    reply_text = reply.get('text')
                    parent_user_id = reply.get('parent_user_id')

                    # リプライが存在するかをチェック
                    existing_reply = db.query(TimesTweet).filter_by(ts=reply_ts).first()
                    if existing_reply:
                        # リプライが存在する場合、内容を更新
                        existing_reply.text = reply_text
                        logger.debug(f"Reply updated: ts={reply_ts}, user_id={reply_user_id}")
                    else:
                        # リプライが存在しない場合、新規に追加
                        reply_record = TimesTweet(
                            ts=reply_ts,
                            user_id=reply_user_id, # user_id => slack_user_idにする(meme)
                            text=reply_text,
                            channel_id=channel_id,
                            thread_ts=thread_ts,
                            parent_user_id=parent_user_id
                        )
                        db.add(reply_record)
                        logger.debug(f"Reply added: ts={reply_ts}, user_id={reply_user_id}")
        
        # コミットして変更を保存
        db.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        db.rollback()  # エラーが発生した場合、ロールバック
        raise HTTPException(status_code=500, detail="Database error")

    return {"status": conversation_history}

