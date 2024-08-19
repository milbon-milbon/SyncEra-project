from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import get_db
from app.db.models import SummarizeHistory
import logging
import os

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_all_saved_summary_reports(slack_user_id: str, db: Session = Depends(get_db)):
    # データベースから該当ユーザーの全てのサマリーデータを取得
    summary_reports = (
        db.query(SummarizeHistory) 
        .filter(SummarizeHistory.slack_user_id == slack_user_id)
        .order_by(desc(SummarizeHistory.created_at))
        .all()
    )

    # データが見つからない場合
    if not summary_reports:
        raise HTTPException(status_code=404, detail="No summary reports found for this slack_user_id")
    logger.debug(f'◆サマリーレポート: {summary_reports}')
    return summary_reports

# #_____挙動テスト用
# slack_user_id='sample_4'
# db=get_db()
# test=get_all_saved_summary_reports(slack_user_id, db)
# print(test)