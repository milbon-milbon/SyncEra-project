from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, get_db
from app.db.models import SlackUserInfo
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

# Slackクライアントの設定
slack_client = WebClient(token=SLACK_TOKEN)

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Slack APIからユーザー情報を取得し、Postgresに保存する関数
def get_and_save_slack_users(db: Session = Depends(get_db)):
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
            profile = user.get("profile", {})
            image_512 = profile.get("image_512")

            # ユーザー情報をデータベースに挿入
            user_record = SlackUserInfo(id=user_id, name=user_name, real_name=real_name, image_512=image_512)
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

    return {"status": users_array}