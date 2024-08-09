from apscheduler.schedulers.background import BackgroundScheduler
from app.util.career_survey.send_survey_to_all import send_survey_to_all #社員全員にアンケート配信するロジック

# アンケートの定期配信を定義: 毎月1日12時に全員にアンケートを配信する
def schedule_survey():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_survey_to_all, 'cron', day=1, hour=12, minute=0)
    scheduler.start()
