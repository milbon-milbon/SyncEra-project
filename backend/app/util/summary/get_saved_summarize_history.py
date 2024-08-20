from fastapi import  HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.database import get_db
from app.db.models import SummarizeHistory
from datetime import datetime
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
        raise HTTPException(status_code=404, detail="サマリーデータが見つかりません")

    logger.debug(f"◆取得したサマリーレポート: {summary_report}")
    return summary_report