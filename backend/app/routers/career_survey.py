from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, APIRouter
from sqlalchemy.orm import Session
from app.db import models, schemas, crud, database, slack
from app.db.database import get_db
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
from app.util.career_survey import get_question, create_response

models.Base.metadata.create_all(bind=database.engine)

router = APIRouter()

# 指定された question_id に対応する質問をデータベースから取得して返す
@router.get("/questions/{question_id}", response_model=schemas.Question)
def read_question(question_id: int, db: Session = Depends(database.get_db)):
    db_question = get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

# ユーザーのアンケート回答を受け取り、データベースに保存
@router.post("/responses/", response_model=schemas.Response)
def create_response(response: schemas.ResponseCreate, db: Session = Depends(database.get_db)):
    db_response = create_response(db, response, employee_id=1)  # 仮にemployee_idを1としています
    return db_response

# これはmain.pyに appで書いてもいいのかも？
@router.on_event("startup")
def startup_event():
    schedule_survey()
