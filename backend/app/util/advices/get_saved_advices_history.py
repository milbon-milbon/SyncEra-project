from fastapi import  HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.database import get_db
from app.db.models import AdvicesHistory
import uuid
from datetime import date, datetime


def get_saved_advices_history(slack_user_id: str, created_at: date = Query(...), db: Session = Depends(get_db)):
    # 該当のslack_user_idとcreated_atの日付でフィルタリング
    advice = db.query(AdvicesHistory).filter(
        and_(
            AdvicesHistory.slack_user_id == slack_user_id,
            AdvicesHistory.created_at == created_at
        )
    ).first()

    # データが見つからない場合
    if not advice:
        raise HTTPException(status_code=404, detail="No advices found for this slack_user_id on the specified date")

    return advice

#_____挙動テスト用
# slack_user_id='sample_4'
# created_at = datetime(2024, 8, 15, 00, 20, 48, 274718)
# db=get_db()
# test=get_saved_advices_history(slack_user_id, created_at, db)
# print(test)