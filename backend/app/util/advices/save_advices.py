from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AdvicesHistory
from app.db.schemas import AdvicesRequest

def save_advices(advices: AdvicesRequest, db: Session = Depends(get_db)):
    # 新しいAdvicesHistoryレコードを作成
    new_advice = AdvicesHistory(
        slack_user_id=advices.slack_user_id,
        advices=advices.advices
    )

    db.add(new_advice)
    db.commit()
    db.refresh(new_advice)

    return {"message": "1on1アドバイスが正常に保存されました", "id": new_advice.id}
