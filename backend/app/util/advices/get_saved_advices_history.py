from fastapi import  HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.database import get_db
from app.db.models import AdvicesHistory
import uuid
from datetime import date


def get_saved_advices_history(employee_id: str, created_at: date = Query(...), db: Session = Depends(get_db)):
    # employee_idをUUIDとして解析
    try:
        employee_uuid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid employee_id format")

    # 該当のemployee_idとcreated_atの日付でフィルタリング
    advice = db.query(AdvicesHistory).filter(
        and_(
            AdvicesHistory.employee_id == employee_uuid,
            AdvicesHistory.created_at == created_at
        )
    ).first()

    # データが見つからない場合
    if not advice:
        raise HTTPException(status_code=404, detail="No advices found for this employee_id on the specified date")

    return advice