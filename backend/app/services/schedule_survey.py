import os
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.util.career_survey.send_survey_to_all import send_survey_to_employee, send_survey_to_all, get_first_question, cache_questions
# from app.util.slack_api.save_cached_daily_reports import save_cached_daily_reports_to_db
from app.db.database import SessionLocal
from pytz import timezone
from dotenv import load_dotenv

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 環境変数の読み込み
load_dotenv()

# アンケートの定期配信を定義:
def schedule_monthly_survey():
    scheduler = BackgroundScheduler(timezone=timezone('Asia/Tokyo'))
    # # 毎日20日12時以降に全員にアンケートを配信する
    # scheduler.add_job(send_survey_to_all, 'cron', day=31, hour=10, minute=30)
    # scheduler.add_job(cache_questions, 'cron', day=31, hour=10, minute=20)

    # 3ヶ月ごとにアンケート送信と質問をキャッシュに保存
    scheduler.add_job(send_survey_to_all, 'cron', month='1,4,7,10', day=1, hour=12, minute=0)
    scheduler.add_job(cache_questions, 'cron', month='1,4,7,10', day=1, hour=11, minute=0)
    scheduler.start()

# アンケートの定期配信を定義: 毎日、30分ごとに特定のSlackユーザーにアンケートを配信する(テスト用なので残しておいてください by sayoko)
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
        'cron', minute='*/30'
    )
    scheduler.start()


# # `save_cached_daily_reports_to_db` を毎日1回、指定の時間に実行するジョブを追加
# def schedule_daily_report_save_to_db():
#     db = SessionLocal()
#     scheduler = BackgroundScheduler(timezone=timezone('Asia/Tokyo'))
#     scheduler.add_job(lambda: save_cached_daily_reports_to_db(SessionLocal()), 'cron', hour=10, minute=10)
#     logger.debug("◆◆日報投稿を保存するスケジュールが設定されました")
#     scheduler.start()
#     logger.debug("◆◆日報投稿を保存するスケジューラが開始されました")