from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, APIRouter
from sqlalchemy.orm import Session
from app.db import models, schemas, crud, database, slack
from apscheduler.schedulers.background import BackgroundScheduler
import datetime

models.Base.metadata.create_all(bind=database.engine)

router = APIRouter()

def schedule_survey():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_survey_to_all, 'cron', day=1, hour=12, minute=0)
    scheduler.start()

def send_survey_to_all():
    db = next(database.get_db())
    employees = db.query(models.Employee).all()
    for employee in employees:
        send_survey(employee.id, db)

def send_survey(employee_id: int, db: Session):
    first_question = db.query(models.Question).first()
    if first_question:
        slack.send_message(user_id=employee_id, text=first_question.question_text)

# 指定された question_id に対応する質問をデータベースから取得して返す
@router.get("/questions/{question_id}", response_model=schemas.Question)
def read_question(question_id: int, db: Session = Depends(database.get_db)):
    db_question = crud.get_question(db, question_id=question_id)
    if db_question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

# ユーザーのアンケート回答を受け取り、データベースに保存
@router.post("/responses/", response_model=schemas.Response)
def create_response(response: schemas.ResponseCreate, db: Session = Depends(database.get_db)):
    db_response = crud.create_response(db, response, employee_id=1)  # 仮にemployee_idを1としています
    return db_response


@router.on_event("startup")
def startup_event():
    schedule_survey()
