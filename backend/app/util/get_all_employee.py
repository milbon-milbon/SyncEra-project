import logging
import os
import json
from dotenv import load_dotenv
from sqlalchemy.orm import joinedload
from app.db.database import get_db
from app.db.models import Employee
from app.services.redis_client import redis_client

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CACHE_KEY = 'all_employee_info'

# すべての従業員の情報を取得する
def get_all_employee():

    # キャッシュあればRedisから取得
    cached_data = redis_client.get(CACHE_KEY)
    if cached_data:
        logger.info(f"◆キャッシュから全ての社員情報を取得しました。")
        logger.info(f"社員情報: {json.loads(cached_data)}")
        return json.loads(cached_data)
    
    # キャッシュなければdbから取得
    db = get_db()
    try:
        # SlackUserInfoを含めたクエリを実行
        all_members = db.query(Employee).options(joinedload(Employee.slack_user_info)).all()
        logger.info(f"◆DBから全ての従業員の情報を取得できました。")

        redis_client.set(CACHE_KEY, json.dumps([member.to_dict() for member in all_members]), ex=2592000) #有効期限:30日間に設定

        return all_members
    except Exception as e:
        logger.error(f"◆従業員の情報を取得中にエラーが発生しました。: {str(e)}")
        return[]
    finally:
        db.close()

# 取得したデータを通常の文字列に変換する必要がある場合は以下の処理を加える。
def compile_all_employee_info():
    pre_all_employee_info = get_all_employee()

    # 会話履歴を文字列に変換
    if not pre_all_employee_info:
        logger.info("◆文字列に変換しようとしている従業員情報が見つかりません。")
        compiled_all_employee_info = "変換したい従業員の情報がありません。"
    else:
        compiled_all_employee_info = "必要に応じてここに出力形式を整える処理を追加する"
        logger.debug(f"◆指定ユーザーの情報を読解可能な文字列に変換しました。")
    
    return compiled_all_employee_info
