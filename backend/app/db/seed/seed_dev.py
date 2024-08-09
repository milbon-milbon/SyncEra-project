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
            id='sample_1',
            name='KU-MIN',
            real_name='kumi ichikawa'
        )

        slack_user_2 = SlackUserInfo(
            id='sample_2',
            name='SAYOKO',
            real_name='sayoko tsukuda'
        )

        slack_user_3 = SlackUserInfo(
            id='sample_3',
            name='MIKIKO',
            real_name='mikiko gaspar'
        )

        slack_user_4 = SlackUserInfo(
            id='sample_4',
            name='MEME',
            real_name='hitomi uchihi'
        )

        db.add_all([slack_user_1, slack_user_2, slack_user_3, slack_user_4])
        db.commit()

        '''>>> daily_report'''

        daily_report_1 = DailyReport(
            user_id='sample_1',
            text='今日はfirebaseの認証機能につい、今回の機能要件と照らし合わせながら、実装方法を検討した。企業のIDを発行させつつ、それを用いて社員の認証認可を確実に行うにはどうしたらいいのか。まだ模索中。がんばりたい。',
            ts=1722856339
        )

        daily_report_2 = DailyReport(
            user_id='sample_2',
            text='今日も引き続きSlackAPIの実装の調整。いい感じに進んでる。そしてフロントとバックの接続もうまくいって、ちょっと安心した。お盆もあるけど最後まで駆け抜けたい!!',
            ts=1722856339
        )

        daily_report_3 = DailyReport(
            user_id='sample_3',
            text='頑張って作ったフロントエンドの画面が好評で嬉しい。fetchは難しいけど繋がった瞬間は嬉しい!!やることたくさんあるけど、ひとつずつ着実に進めたい。',
            ts=1722856339
        )

        daily_report_4 = DailyReport(
            user_id='sample_4',
            text='今日も見えないバックエンドの世界。見えない世界は想像で作り上げるからそれが楽しい。頼もしいサーバーを作るぞ、頑張る。',
            ts=1722856339
        )

        daily_report_5 = DailyReport(
            user_id='sample_1',
            text='Stripeの決済の実装で、手戻り発生。何回も同じところを行き来して、嫌になる....。お盆は少し休みつつ、でも進めて行きたい。',
            ts=1723029139
        )

        daily_report_6 = DailyReport(
            user_id='sample_2',
            text='次はSlackでのアンケート配信の実装に着手。まだ具体的な実装イメージまでいってないけど、しっかりDBと繋げて動かしたい。',
            ts=1723029139
        )

        daily_report_7 = DailyReport(
            user_id='sample_3',
            text='エラーの対応続きで疲れ気味。お盆はしっかり休みを取って回復しつつも、やるべきことはしっかり明確にして取り組みたい。',
            ts=1723029139
        )

        daily_report_8 = DailyReport(
            user_id='sample_4',
            text='関数実装に夢中になっていたけど、ユーザーの操作性や視認性、利便性を考えた出力にも気を回さねば、とハッとしたレビューだった。',
            ts=1723029139
        )

        db.add_all([daily_report_1, daily_report_2, daily_report_3, daily_report_4, daily_report_5, daily_report_6, daily_report_7, daily_report_8])
        db.commit()

        '''>>> employee'''
        employee_1 = Employee(
            id=uuid.uuid4(),
            name='KU-MIN',
            email='kumi_ichikawa@gmail.com',
            department='プロダクト部',
            role='フロントエンド・認証',
            project='SyncEra',
            #slack_user_id='U07FFA7AW1H'
            slack_user_id='sample_1'
        )

        employee_2 = Employee(
            id=uuid.uuid4(),
            name='SAYOKO',
            email='sayoko_tsukuda@gmail.com',
            department='プロダクト部',
            role='バックエンド・インフラ',
            project='SyncEra',
            #slack_user_id='U07F8NPV1RQ'
            slack_user_id='sample_2'
        )

        employee_3 = Employee(
            id=uuid.uuid4(),
            name='MIKIKO',
            email='mikiko_gaspar@gmail.com',
            department='プロダクト部',
            role='フロントエンド・UIデザイン',
            project='SyncEra',
            #slack_user_id='U07FCGJ9SLD'
            slack_user_id='sample_3'
        )

        employee_4 = Employee(
            id=uuid.uuid4(),
            name='MEME',
            email='hitomi_uchihi@gmail.com',
            department='プロダクト部',
            role='バックエンド・データベース',
            project='SyncEra',
            #slack_user_id='U07F0T502G6'
            slack_user_id='sample_4'
        )

        db.add_all([employee_1, employee_2, employee_3, employee_4])
        db.commit()

        '''>>> channel'''

        times_list_1 = TimesList(
            user_id='sample_1',
            channel_name='times_ku-min',
            channel_id='sample_times_1'
        )

        times_list_2 = TimesList(
            user_id='sample_2',
            channel_name='times_sayoko',
            channel_id='sample_times_2'
        )

        times_list_3 = TimesList(
            user_id='sample_3',
            channel_name='times_mikiko',
            channel_id='sample_times_3'
        )

        times_list_4 = TimesList(
            user_id='sample_4',
            channel_name='times_meme',
            channel_id='sample_times_3'
        )

        db.add_all([times_list_1, times_list_2, times_list_3, times_list_4])
        db.commit()

        '''summarize_history'''

        summarize_history_1 = SummarizeHistory(
            employee_id=employee_1.id,
            summary='これは、くーみんさんの日報サマリーの履歴1です。'
        )

        summarize_history_2 = SummarizeHistory(
            employee_id=employee_2.id,
            summary='これは、さよこさんの日報サマリーの履歴1です。'
        )

        summarize_history_3 = SummarizeHistory(
            employee_id=employee_3.id,
            summary='これは、みっこさんの日報サマリーの履歴1です。'
        )

        summarize_history_4 = SummarizeHistory(
            employee_id=employee_4.id,
            summary='これはめめさんの日報サマリーの履歴1です。'
        )

        db.add_all([summarize_history_1, summarize_history_2, summarize_history_3, summarize_history_4])
        db.commit()

        '''advices_history'''

        advices_history_1 = AdvicesHistory(
            employee_id=employee_1.id,
            advices='これはくーみんさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_2 = AdvicesHistory(
            employee_id=employee_2.id,
            advices='これはさよこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_3 = AdvicesHistory(
            employee_id=employee_3.id,
            advices='これはみっこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_4 = AdvicesHistory(
            employee_id=employee_4.id,
            advices='これはめめさんとの1on1のアドバイスのサンプル1です。'
        )

        db.add_all([advices_history_1, advices_history_2, advices_history_3, advices_history_4])
        db.commit()

        '''>>> daily_report'''

        daily_report_9 = DailyReport(
            user_id='sample_1',
            text='''
                コード実装の他にも、ドキュメント整理や作業の一部自動化、発表資料作りなどやることはたくさん。頑張って一つずつ着実に。
                ''',
            ts=1722913939
        )

        daily_report_10 = DailyReport(
            user_id='sample_2',
            text='''
                フロントの処理実装も一部担当することに。めめさんと一緒にバックエンド仕上げていく！頑張ろう。
                ''',
            ts=1722913939
        )

        daily_report_11 = DailyReport(
            user_id='sample_3',
            text='''
                月末の発表会に向けて、ゴリゴリフロント進めていく！各種ページはもちろん、ボタンひとつにもこだわりを持ちたい。
                ''',
            ts=1722913939
        )

        daily_report_12 = DailyReport(
            user_id='sample_4',
            text='''
                最近関数ひとつひとつが生きている様に愛おしく感じる。脳みそが疲れてるんだろうか....ポエムか？
                ''',
            ts=1722913939
        )

        db.add_all([daily_report_9, daily_report_10, daily_report_11, daily_report_12])
        db.commit()

        '''>>> times_tweet'''

        times_tweet_1 = TimesTweet(
            channel_id='sample_times_1',
            user_id='sample_1',
            text='頭がパンパンで、茹でたパスタを水で洗う失態。今日は早く寝る！',
            ts=1722913939
        )

        times_tweet_2 = TimesTweet(
            channel_id='sample_times_2',
            user_id='sample_2',
            text='お盆休み、子供たちがずっと家にいるので賑やかな毎日になりそう。',
            ts=1722913939
        )

        times_tweet_3 = TimesTweet(
            channel_id='sample_times_3',
            user_id='sample_3',
            text='東京は毎日暑くて溶けちゃいそう。早く秋が来ないかな〜',
            ts=1722913939
        )

        times_tweet_4 = TimesTweet(
            channel_id='sample_times_3',
            user_id='sample_3',
            text='今日も大好きなマックが食べられて幸せだ〜',
            ts=1722913939
        )

        db.add_all([times_tweet_1, times_tweet_2, times_tweet_3, times_tweet_4])
        db.commit()

        '''summarize_history_2'''

        summarize_history_5 = SummarizeHistory(
            employee_id=employee_1.id,
            summary='これは、くーみんさんの日報サマリーの履歴1です。'
        )

        summarize_history_6 = SummarizeHistory(
            employee_id=employee_2.id,
            summary='これは、さよこさんの日報サマリーの履歴1です。'
        )

        summarize_history_7 = SummarizeHistory(
            employee_id=employee_3.id,
            summary='これは、みっこさんの日報サマリーの履歴1です。'
        )

        summarize_history_8 = SummarizeHistory(
            employee_id=employee_4.id,
            summary='これはめめさんの日報サマリーの履歴1です。'
        )

        db.add_all([summarize_history_5, summarize_history_6, summarize_history_7, summarize_history_8])
        db.commit()
    
        '''advices_history_2'''

        advices_history_1 = AdvicesHistory(
            employee_id=employee_1.id,
            advices='これはくーみんさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_2 = AdvicesHistory(
            employee_id=employee_2.id,
            advices='これはさよこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_3 = AdvicesHistory(
            employee_id=employee_3.id,
            advices='これはみっこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_4 = AdvicesHistory(
            employee_id=employee_4.id,
            advices='これはめめさんとの1on1のアドバイスのサンプル1です。'
        )

        db.add_all([advices_history_1, advices_history_2, advices_history_3, advices_history_4])
        db.commit()

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()



