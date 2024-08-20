from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import SummarizeHistory
from app.db.schemas import SummaryReportRequest
import uuid

def save_summary_report(report: SummaryReportRequest, db: Session = Depends(get_db)):
    # 新しいSummarizeHistoryレコードを作成
    new_summary = SummarizeHistory(
        slack_user_id=report.slack_user_id,
        summary=report.summary
    )

    # 新しいレコードをデータベースに追加してコミット
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)

    return {"message": "日報サマリーが正常に保存されました", "id": new_summary.id}