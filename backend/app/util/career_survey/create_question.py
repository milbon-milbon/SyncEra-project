from sqlalchemy.orm import Session
from app.db import models, schemas

# 新しい質問を作成してDBに保存する: 使わないかもしれない
def create_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question