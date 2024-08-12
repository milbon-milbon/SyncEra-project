from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, APIRouter, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.db import models, schemas, database
from app.db.database import get_db
from app.db.models import Question, Response
from slack_sdk import WebClient
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
from app.util.career_survey import create_response
from app.util.career_survey import send_survey_to_all

models.Base.metadata.create_all(bind=database.engine)

router = APIRouter()

# 引数に入るquestion.idをもとに、次に出力する質問を選んで返す
# 引数: question_id (int): 現在の質問のID。
#      answer (str): ユーザーが選択した回答。
#      db (Session): SQLAlchemyのデータベースセッションオブジェクト。
# 戻り値: Question: 次の質問オブジェクト。質問がない場合はNoneを返す。
def get_next_question(question_id: int, answer: str, db: Session = Depends(get_db)) -> Question:
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    next_question_id = None
    if answer == 'A':
        next_question_id = question.next_question_a_id
    elif answer == 'B':
        next_question_id = question.next_question_b_id
    elif answer == 'C':
        next_question_id = question.next_question_c_id
    elif answer == 'D':
        next_question_id = question.next_question_d_id



    if not next_question_id:
        return {"message": "No further questions"}
    
    next_question = db.query(models.Question).filter(models.Question.id == next_question_id).first()
    return next_question

