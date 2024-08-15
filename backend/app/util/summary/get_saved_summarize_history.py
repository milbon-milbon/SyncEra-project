from fastapi import  HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.database import get_db
from app.db.models import SummarizeHistory
from datetime import date, datetime
import logging
import os

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_saved_summary_report(slack_user_id: str, created_at: datetime = Query(...), db: Session = Depends(get_db)):
    # 該当のslack_user_idとcreated_atの日付でフィルタリング
    summary_report = db.query(SummarizeHistory).filter(
        and_(
            SummarizeHistory.slack_user_id == slack_user_id,
            SummarizeHistory.created_at == created_at
        )
    ).first()

    # データが見つからない場合
    if not summary_report:
        raise HTTPException(status_code=404, detail="No summary report found for this slack_user_id on the specified date")

    logger.debug(f"◆取得したサマリーレポート: {summary_report}")
    return summary_report


#_____挙動テスト用
# slack_user_id='sample_4'
# created_at = datetime(2024, 8, 14, 23, 42, 56, 744583)
# db=get_db()
# test=get_saved_summary_report(slack_user_id, created_at, db)
# print(test)