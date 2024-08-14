from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import SummarizeHistory
from app.db.schemas import SummaryReportRequest
import uuid

def save_summary_report(report: SummaryReportRequest, db: Session = Depends(get_db)):
    # employee_idをUUIDとして解析する
    try:
        employee_uuid = uuid.UUID(report.employee_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="employee_idの形式が無効です")

    # 新しいSummarizeHistoryレコードを作成
    new_summary = SummarizeHistory(
        employee_id=employee_uuid,
        summary=report.summary
    )

    # 新しいレコードをデータベースに追加してコミット
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)

    return {"message": "日報サマリーが正常に保存されました", "id": new_summary.id}