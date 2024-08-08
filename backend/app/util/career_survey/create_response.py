from sqlalchemy.orm import Session
from app.db import models, schemas

# Slackでアンケートに回答するたびにそれが保存される。（１問ずつ）
# 保存のたびにcreated_atにtimestampが入るので、それでいつのアンケートかを識別する

def create_response(db: Session, response: schemas.ResponseCreate):
    db_response = models.Response(
        slack_user_id_id=response.slack_user_id,
        question_id=response.question_id,
        answer=response.answer,
        free_text=response.free_text
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response