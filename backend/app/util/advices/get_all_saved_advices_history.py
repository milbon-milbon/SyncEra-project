from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AdvicesHistory
import uuid


def get_all_saved_advices_history(employee_id: str, db: Session = Depends(get_db)):
    # employee_idをUUIDとして解析
    try:
        employee_uuid = uuid.UUID(employee_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid employee_id format")

    # データベースから該当ユーザーの全てのサマリーデータを取得
    advices_history = db.query(AdvicesHistory).filter(AdvicesHistory.employee_id == employee_uuid).all()

    # データが見つからない場合
    if not advices_history:
        raise HTTPException(status_code=404, detail="No advices found for this employee_id")

    return advices_history