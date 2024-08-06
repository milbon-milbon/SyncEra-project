import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import (
    Employee,
    SlackUserInfo,
    DailyReport,
    TimesTweet,
    TimesList,
    ContactForm,
    SummarizeHistory,
    AdvicesHistory,
)
from sqlalchemy.exc import SQLAlchemyError

def seed_data():
    db: Session = SessionLocal()

    try:
        '''>>> slack_user_info'''

        slack_user_1 = SlackUserInfo(
            id='slack_user_sample_1',
            name='sam_emp_1',
            real_name='sample_employee_1'
        )

        slack_user_2 = SlackUserInfo(
            id='slack_user_sample_2',
            name='sam_emp_2',
            real_name='sample_employee_2'
        )

        slack_user_3 = SlackUserInfo(
            id='slack_user_sample_3',
            name='sam_emp_3',
            real_name='sample_employee_3'
        )

        db.add_all([slack_user_1, slack_user_2, slack_user_3])
        db.commit()

        '''>>> daily_report'''

        daily_report_1 = DailyReport(
            user_id='slack_user_sample_1',
            text='サンプル投稿だよ。シーディングだよ。///1',
            ts=1618232401
        )

        daily_report_2 = DailyReport(
            user_id='slack_user_sample_2',
            text='サンプル投稿だよ。シーディングだよ。///2',
            ts=1618232402
        )

        daily_report_3 = DailyReport(
            user_id='slack_user_sample_3',
            text='サンプル投稿だよ。シーディングだよ。///3',
            ts=1618232403
        )

        db.add_all([daily_report_1, daily_report_2, daily_report_3])
        db.commit()

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
