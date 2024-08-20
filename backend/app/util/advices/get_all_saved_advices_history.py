from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import get_db
from app.db.models import AdvicesHistory

def get_all_saved_advices_history(slack_user_id: str, db: Session = Depends(get_db)):
    # データベースから該当ユーザーの全てのアドバイスデータを取得
    advices_history = (
        db.query(AdvicesHistory)
        .filter(AdvicesHistory.slack_user_id == slack_user_id)
        .order_by(desc(AdvicesHistory.created_at))
        .all()
    )

    # データが見つからない場合
    if not advices_history:
        raise HTTPException(status_code=404, detail="このユーザーのアドバイスデータが見つかりません")

    return advices_history
