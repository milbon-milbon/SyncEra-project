from sqlalchemy.orm import Session
from app.db import models, schemas

# Slackでアンケートに回答するたびにそれが保存される。（１問ずつ）
# 保存のたびにcreated_atにtimestampが入るので、それでいつのアンケートかを識別する

def create_response(db: Session, response: schemas.ResponseCreate, employee_id: int):
    db_response = models.Response(
        question_id=response.question_id,
        answer=response.answer,
        free_text=response.free_text,
        employee_id=employee_id
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response