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

# さよこさんへ
# このスクリプロファイルが実行されるときに、slackに自動でtimesか何かを投稿するスクリプトを組み込みたいな、
# そうしたら、それをトリガーにして、slack_user_infoテーブルにデータが自動で入るはず！
# それができれば、以下のseedingも続けて自動で実行できるはず。また相談させてね！ meme 8/9

def seed_data():
    db: Session = SessionLocal()

    try:
        '''>>> employee'''
        employee_1 = Employee(
            id=uuid.uuid4(),
            name='くーみん',
            email='kumi_ichikawa@gmail.com',
            department='プロダクト部',
            role='フロントエンド',
            project='SyncEra',
            slack_user_id='U07FFA7AW1H'
        )

        employee_2 = Employee(
            id=uuid.uuid4(),
            name='めめ',
            email='hitomi_uchihi@gmail.com',
            department='プロダクト部',
            role='バックエンド',
            project='SyncEra',
            slack_user_id='U07F8NPV1RQ'
        )

        employee_3 = Employee(
            id=uuid.uuid4(),
            name='みきこ',
            email='mikiko_gaspar@gmail.com',
            department='プロダクト部',
            role='データベース',
            project='SyncEra',
            slack_user_id='U07FCGJ9SLD'
        )

        employee_4 = Employee(
            id=uuid.uuid4(),
            name='さよこ',
            email='sayoko_tsukuda@gmail.com',
            department='プロダクト部',
            role='データベース',
            project='SyncEra',
            slack_user_id='U07F0T502G6'
        )

        db.add_all([employee_1, employee_2, employee_3, employee_4])
        db.commit()

        '''>>> channel'''

        times_list_1 = TimesList(
            user_id='U07FFA7AW1H',
            channel_name='times_ku-min',
            channel_id='C07FMU0BWCB'
        )

        times_list_2 = TimesList(
            user_id='U07F8NPV1RQ',
            channel_name='times_meme',
            channel_id='C07FQFWD3U4'
        )

        times_list_3 = TimesList(
            user_id='U07FCGJ9SLD',
            channel_name='times_3',
            channel_id='C07GAR3EDKJ'
        )

        times_list_4 = TimesList(
            user_id='U07F0T502G6',
            channel_name='times_sayoko',
            channel_id='C07FFAX467M'
        )

        db.add_all([times_list_1, times_list_2, times_list_3, times_list_4])
        db.commit()

        

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
