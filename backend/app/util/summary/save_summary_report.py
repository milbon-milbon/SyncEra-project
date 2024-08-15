from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
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


#__挙動テスト用 : OK
# test_report = SummaryReportRequest(
#     slack_user_id='sample_4',
#     summary='テスト：サマリー保存'
# )

# db=get_db()
# response=save_summary_report(test_report, db)
# print(response)