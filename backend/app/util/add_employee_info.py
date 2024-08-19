import logging
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from slack_sdk.errors import SlackApiError
from slack_sdk import WebClient
from app.db.models import Employee
from app.db.database import get_db
from app.db.schemas import EmployeeCreate

# 環境変数の読み込み
load_dotenv()

# Slack APIクライアントの設定
SLACK_TOKEN = os.getenv("SLACK_API_KEY")
slack_client = WebClient(token=SLACK_TOKEN)

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ルーターの定義
router = APIRouter()

# 新しい従業員をデータベースに登録する関数
def add_employee(db: Session, employee: EmployeeCreate):
    db = get_db()
    try:
        # Slack APIを使ってSlackユーザーIDを取得
        try:
            response = slack_client.users_lookupByEmail(email=employee.email)
            slack_user_id = response['user']['id']
            logger.debug(f"Slack ID '{slack_user_id}' がメール '{employee.email}' から取得されました。")
        except SlackApiError as e:
            logger.error(f"Slack APIエラー: {e.response['error']}")
            raise HTTPException(status_code=400, detail=f"Slackユーザーの取得に失敗しました: {e.response['error']}")

        # 従業員をデータベースに登録
        db_employee = Employee(
            name=employee.name, 
            email=employee.email, 
            department=employee.department, 
            role=employee.role, 
            project=employee.project, 
            slack_user_id=slack_user_id
        ) 
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        logger.debug(f"◆新しい従業員がデータベースに登録されました: {db_employee.name}")
        return db_employee
    except Exception as e:
        logger.error(f"◆従業員の登録中にエラーが発生しました。: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail="◆従業員の登録に失敗しました")