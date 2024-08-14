from fastapi import  HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.database import get_db
from app.db.models import SummarizeHistory
import uuid
from datetime import date


def get_saved_summary_report(employee_id: str, created_at: date = Query(...), db: Session = Depends(get_db)):
    # employee_idをUUIDとして解析
    try:
        employee_uuid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid employee_id format")

    # 該当のemployee_idとcreated_atの日付でフィルタリング
    summary_report = db.query(SummarizeHistory).filter(
        and_(
            SummarizeHistory.employee_id == employee_uuid,
            SummarizeHistory.created_at == created_at
        )
    ).first()

    # データが見つからない場合
    if not summary_report:
        raise HTTPException(status_code=404, detail="No summary report found for this employee_id on the specified date")

    return summary_report
