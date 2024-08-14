from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AdvicesHistory
import uuid


def get_all_saved_advices_history(slack_user_id: str, db: Session = Depends(get_db)):
    # データベースから該当ユーザーの全てのアドバイシャリーデータを取得
    advices_history = db.query(AdvicesHistory).filter(AdvicesHistory.slack_user_id == slack_user_id).all()

    # データが見つからない場合
    if not advices_history:
        raise HTTPException(status_code=404, detail="No advices found for this slack_user_id")

    return advices_history