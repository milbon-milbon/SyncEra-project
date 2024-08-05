import time
from fastapi import APIRouter
from sqlalchemy import create_engine, Column, String, Integer, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv
import os
import logging

router = APIRouter()

# .envファイルから環境変数を読み込む
load_dotenv()

# Slack APIトークンを設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")

# WebClientを定義
client = WebClient(token=SLACK_TOKEN)

# ロガーを設定
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# SQLAlchemyのベースモデルを定義
Base = declarative_base()

class SlackUserInfo(Base):
    __tablename__ = 'slack_user_info'

    id = Column(String(100), primary_key=True)
    name = Column(String(100), nullable=False)
    real_name = Column(String(100), nullable=False)

class DailyReport(Base):
    __tablename__ = 'daily_report'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    text = Column(Text, nullable=False)
    ts = Column(String, nullable=False)
    edited = Column(String, nullable=True) # 編集内容
    edited_by = Column(String(100), nullable=True) # 編集者
    edited_ts = Column(String, nullable=True) # 編集時のts

# DATABASE_URLからPostgreSQLデータベースへの接続を試みる関数
def connect_to_db():
    retry_count = 5
    while retry_count > 0:
        try:
            database_url = os.getenv("DATABASE_URL")
            logger.debug(f"Connecting to database at {database_url}")
            engine = create_engine(database_url, echo=True)  # echo=TrueでSQLAlchemyのすべてのSQLをログに出力
            Base.metadata.create_all(engine)
            Session = sessionmaker(bind=engine)
            return Session()
        except Exception as e:
            logger.error("Unable to connect to the database. Retrying in 5 seconds...")
            logger.error(e)
            retry_count -= 1
            time.sleep(5)
    raise Exception("Could not connect to the database after several attempts")

# Slack APIからユーザー情報を取得し、Postgresに保存する関数
def get_and_save_users():
    # データベースセッションを確立
    session = connect_to_db()
    try:
        # users.listメソッドを使用してユーザー情報を取得
        result = client.users_list()
        users_array = result["members"]

        # 結果をログに出力
        logger.info("{} users found".format(len(users_array)))

        for user in users_array:
            user_id = user["id"]
            user_name = user.get("name")
            real_name = user.get("real_name")
            email = user.get("profile", {}).get("email")

            # ユーザー情報をデータベースに挿入
            user_record = User(user_id=user_id, name=user_name, real_name=real_name, email=email)
            session.merge(user_record)  # 存在する場合は更新し、存在しない場合は挿入
        
        # コミットして変更を保存
        session.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        return {"error": str(e)}
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        session.rollback()  # エラーが発生した場合、ロールバック

    finally:
        session.close()  # 最後にセッションを閉じる

    return {"status": "success"}


# 日報が投稿された時　`POST /post_daily_report`　`by Slack`
# Slack APIからdaily_reportチャンネルの投稿情報を取得し、Postgresに保存する関数
@router.post("/post_daily_report/")
def get_and_save_daily_report():
    # データベースセッションを確立
    session = connect_to_db()

    conversation_history = []
    channel_id = os.getenv("DAILY_REPORT_CHANNEL_ID")

    try:
        # conversations.historyメソッドを使用してチャンネルのメッセージを取得
        result = client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]

        # 結果をログに出力
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))

        for message in conversation_history:
            ts = message.get('ts')
            user_id = message.get('user')
            text = message.get('text')
            thread_ts = message.get('thread_ts')
            parent_message_id = None  # スレッドの場合は適切なIDを設定する必要があります

            # ユーザー情報をデータベースに挿入
            message_record = Message(ts=ts, user_id=user_id, text=text, thread_ts=thread_ts, parent_message_id=parent_message_id)
            session.merge(message_record)  # 存在する場合は更新し、存在しない場合は挿入
        
        # コミットして変更を保存
        session.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        return {"error": str(e)}
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        session.rollback()  # エラーが発生した場合、ロールバック

    finally:
        session.close()  # 最後にセッションを閉じる

    return {"status": "success"}

# timesに投稿があった時 `POST /post_times` 　`by Slack`
@router.post("/post_times")
def save_times_tweet():
    return "処理なども全て未実装、随時ここは追記していく"

# キャリアアンケート実施のリクエストがあった時　GET or POST /execution_career_survey by Slack
@router.get("/execution_career_survey") # または @router.post("/execution_career_survey")
def execution_career_survey():
    return "処理なども全て未実装、随時ここは追記していく"
