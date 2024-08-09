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
        '''>>> employee'''
        employee_1 = Employee(
            id=uuid.uuid4(),
            name='ku-min',
            email='sample_employee_1@gmail.com',
            department='プロダクト部１',
            role='フロントエンド',
            project='SyncEra',
            slack_user_id='U07FFA7AW1H'
        )

        employee_2 = Employee(
            id=uuid.uuid4(),
            name='meme',
            email='sample_employee_2@gmail.com',
            department='プロダクト部２',
            role='バックエンド',
            project='SyncEra',
            slack_user_id='U07F8NPV1RQ'
        )

        employee_3 = Employee(
            id=uuid.uuid4(),
            name='mikiko',
            email='sample_employee_3@gmail.com',
            department='プロダクト部３',
            role='データベース',
            project='SyncEra',
            slack_user_id='U07FCGJ9SLD'
        )

        employee_4 = Employee(
            id=uuid.uuid4(),
            name='sayoko',
            email='sample_employee_3@gmail.com',
            department='プロダクト部３',
            role='データベース',
            project='SyncEra',
            slack_user_id='U07F0T502G6'
        )

        db.add_all([employee_1, employee_2, employee_3, employee_4])
        db.commit()

        # '''>>> channel'''

        # times_list_1 = TimesList(
        #     user_id='slack_user_sample_1',
        #     channel_name='times_1',
        #     channel_id='sample_times_1'
        # )

        # times_list_2 = TimesList(
        #     user_id='slack_user_sample_2',
        #     channel_name='times_2',
        #     channel_id='sample_times_2'
        # )

        # times_list_3 = TimesList(
        #     user_id='slack_user_sample_3',
        #     channel_name='times_3',
        #     channel_id='sample_times_3'
        # )

        # db.add_all([times_list_1, times_list_2, times_list_3])
        # db.commit()

        # '''summarize_history'''

        # summarize_history_1 = SummarizeHistory(
        #     employee_id=employee_1.id,
        #     summary='これはサマリーデータのサンプル１です。'
        # )

        # summarize_history_2 = SummarizeHistory(
        #     employee_id=employee_2.id,
        #     summary='これはサマリーデータのサンプル2です。'
        # )

        # summarize_history_3 = SummarizeHistory(
        #     employee_id=employee_3.id,
        #     summary='これはサマリーデータのサンプル3です。'
        # )

        # db.add_all([summarize_history_1, summarize_history_2, summarize_history_3])
        # db.commit()

        # '''advices_history'''

        # advices_history_1 = AdvicesHistory(
        #     employee_id=employee_1.id,
        #     advices='これは1on1アドバイスのサンプル1です。'
        # )

        # advices_history_2 = AdvicesHistory(
        #     employee_id=employee_2.id,
        #     advices='これは1on1アドバイスのサンプル2です。'
        # )

        # advices_history_3 = AdvicesHistory(
        #     employee_id=employee_3.id,
        #     advices='これは1on1アドバイスのサンプル3です。'
        # )

        # db.add_all([advices_history_1, advices_history_2, advices_history_3])
        # db.commit()

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
