import logging
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import and_
# from app.db.database import SessionLocal
# from app.db.models import テーブル名

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# データベースセッションの取得：データベースの操作を行うためのセッション
SessionLocal = "DB設定終わったらimportのコメントアウトを解除する" #この行の削除を忘れないように
def get_db_session() -> Session:
    return SessionLocal()

def get_daily_report(user_id: str, start_date, end_date):
    # データベースから指定したユーザーの指定期間分の日報データを取得する
    db = get_db_session()
    try:
        target_daily_report = db.query(テーブル名).filter(
            and_(
                テーブル名.user_id == user_id,
                テーブル名.time_stamp >= start_date,
                テーブル名.time_stamp <= end_date
            )
        ).all()
        logger.debug("◆DBから正常に日報データを取得できました。")
        return target_daily_report
    except Exception:
        logger.error(f"◆daily_reportの取得中にエラーが発生しました。: {Exception}")
        return[]
    finally:
        db.close()

# 取得したデータを通常の文字列に変換する必要がある場合は以下の処理を加える。
def compile_daily_report_data(user_id: str, start_date, end_date):
    pre_daily_report_data = get_daily_report(user_id, start_date, end_date)

    # 会話履歴を文字列に変換
    if not pre_daily_report_data:
        logger.info("文字列に変換しようとしている日報データが見つからないか、空のようです。")
        compiled_daily_report_data = "日報記録がありません。"
    else:
        compiled_daily_report_data = "必要に応じてここに出力形式を整える処理を追加する"
        logger.debug("◆日報データを読解可能な文字列に変換しました。")
    
    return compiled_daily_report_data