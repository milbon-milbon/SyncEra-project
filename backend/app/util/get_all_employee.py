import logging
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Employee

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# すべての従業員の情報を取得する
def get_all_employee():
    # データベースからuser情報を取得してくる
    db = get_db()
    try:
        all_members = db.query(Employee).all()
        logger.debug(f"◆DBから全ての従業員の情報を取得できました。")
        return all_members
    except Exception:
        logger.error(f"◆従業員の情報を取得中にエラーが発生しました。: {Exception}")
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
