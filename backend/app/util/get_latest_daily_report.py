import logging
import os
from dotenv import load_dotenv
from app.db.models import DailyReport
from app.db.database import get_db

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_latest_daily_report(slack_user_id: str):
    # データベースから指定したユーザーの最新の日報データを取得する
    db = get_db()
    try:
        latest_daily_report = db.query(DailyReport).filter(
            DailyReport.slack_user_id == slack_user_id
        ).order_by(DailyReport.ts.desc()).first()  # 最新の日報のみ取得
        if latest_daily_report:
            logger.debug("◆DBから正常に最新の日報データを取得できました。")
        else:
            logger.info("◆指定されたユーザーの日報データが見つかりませんでした。")
        return latest_daily_report
    except Exception as e:
        logger.error(f"◆daily_reportの取得中にエラーが発生しました。: {str(e)}")
        return None
    finally:
        db.close()