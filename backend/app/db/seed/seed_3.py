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
import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal

def seed_data():
    db: Session = SessionLocal()

    try:
        '''>>> daily_report'''

        daily_report_1 = DailyReport(
            user_id='slack_user_sample_1',
            text='''
                ユーザー：１
                私は345。SlackAPIと戦っている。LINEよりはマシだ。
                mikikoリーダーがきっと、この日報を見て褒めてくれるはずだ。
                ''',
            ts=1618232401
        )

        daily_report_2 = DailyReport(
            user_id='slack_user_sample_2',
            text='''
                ユーザー：２
                私は93。決済機能と認証の概念と戦っている。複雑だ。
                mikikoリーダーがきっと、この日報を見て褒めてくれるはずだ。
                ''',
            ts=1618232402
        )

        daily_report_3 = DailyReport(
            user_id='slack_user_sample_3',
            text='''
                ユーザー：３
                私はmeme。dbと戦っている。これからボスのAIアルゴリズムが待ってる。
                mikikoリーダーがきっと、この日報を見て褒めてくれるはずだ。
                ''',
            ts=1618232403
        )

        db.add_all([daily_report_1, daily_report_2, daily_report_3])
        db.commit()

        '''>>> times_tweet'''

        times_tweet_1 = TimesTweet(
            channel_id='sample_times_1',
            user_id='slack_user_sample_1',
            text='SlackAPI、難しいけど、どうにかなってきた〜。LINEよりはマシかもだけど。疲れたなあ〜！（timesのつぶやきのサンプルデータだよ。///1）',
            ts=16182325001
        )

        times_tweet_2 = TimesTweet(
            channel_id='sample_times_2',
            user_id='slack_user_sample_2',
            text='決済機能の実装難しいわ〜。BC始まってから世の中のいろんな仕組みとか機能見るとおののくようになった。笑（timesのつぶやきのサンプルデータだよ。///2）',
            ts=16182325002
        )

        times_tweet_3 = TimesTweet(
            channel_id='sample_times_3',
            user_id='slack_user_sample_3',
            text='おなかがすいたなあ。アイスが食べたいなあ。どら焼きでもいいなあ。（timesのつぶやきのサンプルデータだよ。///3）',
            ts=16182325003
        )

        db.add_all([times_tweet_1, times_tweet_2, times_tweet_3])
        db.commit()


        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
