from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import SummarizeHistory
import uuid

router = APIRouter()

def get_all_saved_summary_reports(employee_id: str, db: Session = Depends(get_db)):
    # employee_idをUUIDとして解析
    try:
        employee_uuid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid employee_id format")

    # データベースから該当ユーザーの全てのサマリーデータを取得
    summary_reports = db.query(SummarizeHistory).filter(SummarizeHistory.employee_id == employee_uuid).all()

    # データが見つからない場合
    if not summary_reports:
        raise HTTPException(status_code=404, detail="No summary reports found for this employee_id")

    return summary_reports
