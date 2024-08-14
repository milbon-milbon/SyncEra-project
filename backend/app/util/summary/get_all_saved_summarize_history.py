from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import SummarizeHistory
import uuid

def get_all_saved_summary_reports(slack_user_id: str, db: Session = Depends(get_db)):
    # データベースから該当ユーザーの全てのサマリーデータを取得
    summary_reports = db.query(SummarizeHistory).filter(SummarizeHistory.slack_user_id == slack_user_id).all()

    # データが見つからない場合
    if not summary_reports:
        raise HTTPException(status_code=404, detail="No summary reports found for this slack_user_id")

    return summary_reports