import time
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
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
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# SQLAlchemyのベースモデルを定義
Base = declarative_base()

# Usersテーブルを定義
class User(Base):
    __tablename__ = 'Users'
    user_id = Column(String, primary_key=True)
    name = Column(String)
    real_name = Column(String)
    email = Column(String)

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


