import logging
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.models import DailyReport
from .convert_to_unix_timestamp import convert_to_unix_timestamp
from datetime import date

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
from app.db.database import get_db

def get_daily_report(slack_user_id: str, start_date:date, end_date:date):
    # YYYY-MM-DD を Unixタイムスタンプの形式に変換する
    start_ts = convert_to_unix_timestamp(start_date)
    end_ts = convert_to_unix_timestamp(end_date)

    # データベースから指定したユーザーの指定期間分の日報データを取得する
    db = get_db()
    try:
        target_daily_report = db.query(DailyReport).filter(
            and_(
                DailyReport.user_id == slack_user_id,
                DailyReport.ts >= start_ts, 
                DailyReport.ts <= end_ts
            )
        ).all()
        logger.debug("◆DBから正常に日報データを取得できました。")
        return target_daily_report
    except Exception as e:
        logger.error(f"◆daily_reportの取得中にエラーが発生しました。: {e}")
        return[]
    finally:
        db.close()

# 取得したデータを通常の文字列に変換する必要がある場合は以下の処理を加える。
def compile_daily_report_data(slack_user_id: str, start_date, end_date):
    pre_daily_report_data = get_daily_report(slack_user_id, start_date, end_date)

    # 会話履歴を文字列に変換
    if not pre_daily_report_data:
        logger.info("文字列に変換しようとしている日報データが見つからないか、空のようです。")
        compiled_daily_report_data = "日報記録がありません。"
    else:
        compiled_daily_report_data = "必要に応じてここに出力形式を整える処理を追加する"
        logger.debug("◆日報データを読解可能な文字列に変換しました。")
    
    return compiled_daily_report_data