from sqlalchemy.orm import Session
from app.db import models, schemas

# 質問IDに基づいてデータベースから質問を取得する

def get_question(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()