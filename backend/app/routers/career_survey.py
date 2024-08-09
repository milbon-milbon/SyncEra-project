from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, APIRouter
from sqlalchemy.orm import Session
from app.db import models, schemas, database
from app.db.database import get_db
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
from app.util.career_survey import create_response
from app.util.career_survey import _____get_question

models.Base.metadata.create_all(bind=database.engine)

router = APIRouter()

# 引数に入るquestion.idをもとに、次に出力する質問を選んで返す
def get_next_question(question_id: int, answer: str, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
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
    elif "最後の質問の場合の終了方法を定義する":
        "最後の質問の場合の終了方法を定義する, return 送信ボタン的な？"


    if not next_question_id:
        return {"message": "No further questions"}
    
    next_question = db.query(models.Question).filter(models.Question.id == next_question_id).first()
    return next_question

# アンケートの回答が確定するたびにDBに保存し、次の質問を出力する
@router.post("/submit")
def submit_answer(response: schemas.ResponseBase, db: Session = Depends(get_db)):
    db_response = create_response(db, response)
    next_question = get_next_question(response.question_id, response.answer, db)
    return next_question

@router.post("/finish_survey")
def finish_survey(response: schemas.ResponseBase, db: Session = Depends(get_db)):
    db_response = create_response(db, response) #最後の質問の回答をDB保存
    return " アンケートの回答を送信しました！ご回答ありがとうございました。"

# _______________以下、おそらく使用しない_________________

# 指定された question_id に対応する質問をデータベースから取得して返す
# @router.get("/questions/{question_id}", response_model=schemas.Question)
# def read_question(question_id: int, db: Session = Depends(database.get_db)):
#     db_question = get_question(db, question_id=question_id)
#     if db_question is None:
#         raise HTTPException(status_code=404, detail="Question not found")
#     return db_question

# # ユーザーのアンケート回答を受け取り、データベースに保存
# @router.post("/responses/", response_model=schemas.Response)
# def create_response(response: schemas.ResponseCreate, db: Session = Depends(database.get_db)):
#     db_response = create_response(db, response, employee_id=1)  # 仮にemployee_idを1としています
#     return db_response

# これはmain.pyに appで書いてもいいのかも？
# アプリーケーション起動時に、スケジューリング機能が働きダウ
# @router.on_event("startup")
# def startup_event():
#     schedule_survey()
