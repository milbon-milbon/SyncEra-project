import os
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.util.career_survey.send_survey_to_all import send_survey_to_all #社員全員にアンケート配信するロジック
from app.util.career_survey.send_survey_to_all import send_survey_to_employee
from app.db.database import get_db
from app.db.database import SessionLocal
from app.db.models import Question
from app.util.career_survey.question_cache import serialize_question, clear_question_cache
from sqlalchemy.orm import Session
from pytz import timezone
from dotenv import load_dotenv
from redis import Redis

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 環境変数の読み込み
load_dotenv()

# Redisクライアントの設定
REDIS_HOST = os.getenv("REDIS_HOST", "redis") # "redis"部分はコンテナでの開発時。ローカルの時はlocalhost
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT)

# 初回の質問を取得するためのヘルパー関数
# 引数: db (Session): SQLAlchemyのデータベースセッションオブジェクト。
# 戻り値: Question: データベースから取得した初回の質問オブジェクト。
def get_first_question(db: Session) -> Question:
    first_question = db.query(Question).filter(Question.id == 1).first()  # id=1 の質問を初回の質問とみなして取得
    return first_question

# アンケートの質問をキャッシュに保存する関数
def cache_questions():
    db = SessionLocal()
    try:
        questions = db.query(Question).all()
        for question in questions:
            question_key = f"question:{question.id}"
            serialized_question = serialize_question(question)
            redis_client.set(question_key, serialized_question)
            logger.info(f"キャッシュに質問を保存しました: {question_key}")
    finally:
        db.close()

# アンケートの定期配信を定義: 毎月1日12時に全員にアンケートを配信する
def schedule_monthly_survey():
    scheduler = BackgroundScheduler(timezone=timezone('Asia/Tokyo'))
    scheduler.add_job(send_survey_to_all, 'cron', day=22, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', day=22, hour=11, minute=0)
    scheduler.add_job(send_survey_to_all, 'cron', day=23, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', day=23, hour=11, minute=0)
    scheduler.add_job(send_survey_to_all, 'cron', day=24, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', day=24, hour=11, minute=0)
    scheduler.add_job(send_survey_to_all, 'cron', day=25, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', day=25, hour=11, minute=0)
    scheduler.add_job(send_survey_to_all, 'cron', day=26, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', day=26, hour=11, minute=0)
    
    # 3ヶ月ごとにアンケート送信
    scheduler.add_job(send_survey_to_all, 'cron', month='1,4,7,10', day=1, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', month='1,4,7,10', day=1, hour=11, minute=0)
    scheduler.start()

# アンケートの定期配信を定義: 毎日、30分ごとに特定のSlackユーザー(sayoko)にアンケートを配信する(テスト用)
# 引数: なし
# 戻り値: なし
def schedule_hourly_survey() -> None:
    scheduler = BackgroundScheduler(timezone=timezone('Asia/Tokyo'))
    # 初回の質問を取得して送信
    def job_function():
            db = SessionLocal()
            slack_user_id = os.getenv("SLACK_USER_ID")
            cache_questions()
            try:
                first_question = get_first_question(db)
                send_survey_to_employee(slack_user_id, first_question)
            finally:
                db.close()

    scheduler.add_job(
        job_function,
        'cron', minute='*/5'
    )
    scheduler.start()
