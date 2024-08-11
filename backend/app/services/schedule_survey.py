from apscheduler.schedulers.background import BackgroundScheduler
from app.util.career_survey.send_survey_to_all import send_survey_to_all #社員全員にアンケート配信するロジック
from app.util.career_survey.send_survey_to_all import send_survey_to_employee
from app.db.database import get_db
from app.db.database import SessionLocal
from app.db.models import Question
from sqlalchemy.orm import Session

# 初回の質問を取得するためのヘルパー関数
# 引数: db (Session): SQLAlchemyのデータベースセッションオブジェクト。
# 戻り値: Question: データベースから取得した初回の質問オブジェクト。
def get_first_question(db: Session) -> Question:
    first_question = db.query(Question).filter(Question.id == 1).first()  # id=1 の質問を初回の質問とみなして取得
    return first_question

# アンケートの定期配信を定義: 毎月1日12時に全員にアンケートを配信する
def schedule_monthly_survey():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_survey_to_all, 'cron', day=1, hour=12, minute=0)
    scheduler.start()

# アンケートの定期配信を定義: 毎日、5分ごとに特定のSlackユーザー(sayoko)にアンケートを配信する
# 引数: なし
# 戻り値: なし
def schedule_hourly_survey() -> None:
    scheduler = BackgroundScheduler()

    def job_function():
            db = SessionLocal()
            try:
                first_question = get_first_question(db)
                send_survey_to_employee("U07F0T502G6", first_question)
            finally:
                db.close()

    scheduler.add_job(
        job_function,  # 初回の質問を取得して送信
        'cron', minute='*/30'  # 毎5分ごとに実行
    )
    scheduler.start()
