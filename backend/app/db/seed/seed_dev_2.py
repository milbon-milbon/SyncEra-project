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
    Question
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
            slack_user_id='sample_1',
            text='今日はfirebaseの認証機能につい、今回の機能要件と照らし合わせながら、実装方法を検討した。企業のIDを発行させつつ、それを用いて社員の認証認可を確実に行うにはどうしたらいいのか。まだ模索中。がんばりたい。',
            ts=1722856339
        )

        daily_report_2 = DailyReport(
            slack_user_id='sample_2',
            text='今日も引き続きSlackAPIの実装の調整。いい感じに進んでる。そしてフロントとバックの接続もうまくいって、ちょっと安心した。お盆もあるけど最後まで駆け抜けたい!!',
            ts=1722856339
        )

        daily_report_3 = DailyReport(
            slack_user_id='sample_3',
            text='頑張って作ったフロントエンドの画面が好評で嬉しい。fetchは難しいけど繋がった瞬間は嬉しい!!やることたくさんあるけど、ひとつずつ着実に進めたい。',
            ts=1722856339
        )

        daily_report_4 = DailyReport(
            slack_user_id='sample_4',
            text='今日も見えないバックエンドの世界。見えない世界は想像で作り上げるからそれが楽しい。頼もしいサーバーを作るぞ、頑張る。',
            ts=1722856339
        )

        daily_report_5 = DailyReport(
            slack_user_id='sample_1',
            text='Stripeの決済の実装で、手戻り発生。何回も同じところを行き来して、嫌になる....。お盆は少し休みつつ、でも進めて行きたい。',
            ts=1723029139
        )

        daily_report_6 = DailyReport(
            slack_user_id='sample_2',
            text='次はSlackでのアンケート配信の実装に着手。まだ具体的な実装イメージまでいってないけど、しっかりDBと繋げて動かしたい。',
            ts=1723029139
        )

        daily_report_7 = DailyReport(
            slack_user_id='sample_3',
            text='エラーの対応続きで疲れ気味。お盆はしっかり休みを取って回復しつつも、やるべきことはしっかり明確にして取り組みたい。',
            ts=1723029139
        )

        daily_report_8 = DailyReport(
            slack_user_id='sample_4',
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
            slack_user_id='sample_1',
            channel_name='times_ku-min',
            channel_id='sample_times_1'
        )

        times_list_2 = TimesList(
            slack_user_id='sample_2',
            channel_name='times_sayoko',
            channel_id='sample_times_2'
        )

        times_list_3 = TimesList(
            slack_user_id='sample_3',
            channel_name='times_mikiko',
            channel_id='sample_times_3'
        )

        times_list_4 = TimesList(
            slack_user_id='sample_4',
            channel_name='times_meme',
            channel_id='sample_times_4'
        )

        db.add_all([times_list_1, times_list_2, times_list_3, times_list_4])
        db.commit()

        '''summarize_history'''

        summarize_history_1 = SummarizeHistory(
            slack_user_id=slack_user_1.id,
            summary='これは、くーみんさんの日報サマリーの履歴1です。'
        )

        summarize_history_2 = SummarizeHistory(
            slack_user_id=slack_user_2.id,
            summary='これは、さよこさんの日報サマリーの履歴1です。'
        )

        summarize_history_3 = SummarizeHistory(
            slack_user_id=slack_user_3.id,
            summary='これは、みっこさんの日報サマリーの履歴1です。'
        )

        summarize_history_4 = SummarizeHistory(
            slack_user_id=slack_user_4.id,
            summary='これはめめさんの日報サマリーの履歴1です。'
        )

        db.add_all([summarize_history_1, summarize_history_2, summarize_history_3, summarize_history_4])
        db.commit()

        '''advices_history'''

        advices_history_1 = AdvicesHistory(
            slack_user_id=slack_user_1.id,
            advices='これはくーみんさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_2 = AdvicesHistory(
            slack_user_id=slack_user_2.id,
            advices='これはさよこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_3 = AdvicesHistory(
            slack_user_id=slack_user_3.id,
            advices='これはみっこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_4 = AdvicesHistory(
            slack_user_id=slack_user_4.id,
            advices='これはめめさんとの1on1のアドバイスのサンプル1です。'
        )

        db.add_all([advices_history_1, advices_history_2, advices_history_3, advices_history_4])
        db.commit()

        '''>>> daily_report'''

        daily_report_9 = DailyReport(
            slack_user_id='sample_1',
            text='''
                コード実装の他にも、ドキュメント整理や作業の一部自動化、発表資料作りなどやることはたくさん。頑張って一つずつ着実に。
                ''',
            ts=1722913939
        )

        daily_report_10 = DailyReport(
            slack_user_id='sample_2',
            text='''
                フロントの処理実装も一部担当することに。めめさんと一緒にバックエンド仕上げていく！頑張ろう。
                ''',
            ts=1722913939
        )

        daily_report_11 = DailyReport(
            slack_user_id='sample_3',
            text='''
                月末の発表会に向けて、ゴリゴリフロント進めていく！各種ページはもちろん、ボタンひとつにもこだわりを持ちたい。
                ''',
            ts=1722913939
        )

        daily_report_12 = DailyReport(
            slack_user_id='sample_4',
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
            slack_user_id='sample_1',
            text='頭がパンパンで、茹でたパスタを水で洗う失態。今日は早く寝る！',
            ts=1722913939
        )

        times_tweet_2 = TimesTweet(
            channel_id='sample_times_2',
            slack_user_id='sample_2',
            text='お盆休み、子供たちがずっと家にいるので賑やかな毎日になりそう。',
            ts=1722913939
        )

        times_tweet_3 = TimesTweet(
            channel_id='sample_times_3',
            slack_user_id='sample_3',
            text='東京は毎日暑くて溶けちゃいそう。早く秋が来ないかな〜',
            ts=1722913939
        )

        times_tweet_4 = TimesTweet(
            channel_id='sample_times_4',
            slack_user_id='sample_4',
            text='今日も大好きなマックが食べられて幸せだ〜',
            ts=1722913939
        )

        db.add_all([times_tweet_1, times_tweet_2, times_tweet_3, times_tweet_4])
        db.commit()

        '''summarize_history_2'''

        summarize_history_5 = SummarizeHistory(
            slack_user_id=slack_user_1.id,
            summary='これは、くーみんさんの日報サマリーの履歴1です。'
        )

        summarize_history_6 = SummarizeHistory(
            slack_user_id=slack_user_2.id,
            summary='これは、さよこさんの日報サマリーの履歴1です。'
        )

        summarize_history_7 = SummarizeHistory(
            slack_user_id=slack_user_3.id,
            summary='これは、みっこさんの日報サマリーの履歴1です。'
        )

        summarize_history_8 = SummarizeHistory(
            slack_user_id=slack_user_4.id,
            summary='これはめめさんの日報サマリーの履歴1です。'
        )

        db.add_all([summarize_history_5, summarize_history_6, summarize_history_7, summarize_history_8])
        db.commit()
    
        '''advices_history_2'''

        advices_history_1 = AdvicesHistory(
            slack_user_id=slack_user_1.id,
            advices='これはくーみんさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_2 = AdvicesHistory(
            slack_user_id=slack_user_2.id,
            advices='これはさよこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_3 = AdvicesHistory(
            slack_user_id=slack_user_3.id,
            advices='これはみっこさんとの1on1のアドバイスのサンプル1です。'
        )

        advices_history_4 = AdvicesHistory(
            slack_user_id=slack_user_4.id,
            advices='これはめめさんとの1on1のアドバイスのサンプル1です。'
        )

        db.add_all([advices_history_1, advices_history_2, advices_history_3, advices_history_4])
        db.commit()

        ''' >> Questions '''

        question1 = Question(
            question_text="アンケートの回答を始めますか？",
            choice_a="始める",
            next_question_a_id=2,
        )

        question2 = Question(
            question_text='現在の職務内容について、どのように感じていますか？',
            choice_a='ちょうど良い',
            choice_b='やや負担が大きい',
            choice_c='もっと幅を広げたい',
            choice_d='違うポジションや業務へ興味',
            next_question_a_id=3,
            next_question_b_id=4,
            next_question_c_id=3,
            next_question_d_id=5,
        )

        question3 = Question(
            question_text='これから、どのように自身を成長させていきたいですか？',
            choice_a='今の仕事を極める',
            choice_b='今の仕事を起点にステップアップ',
            choice_c='より責任のある仕事に挑戦',
            choice_d='自分の中で模索中',
            next_question_a_id=6,
            next_question_b_id=6,
            next_question_c_id=6,
            next_question_d_id=6,
        )

        question4 = Question(
            question_text='どんなときに、しんどさや負担を感じますか？',
            choice_a='タスクが過量 or 高難易度',
            choice_b='メンバー育成/マネジメント',
            choice_c='部署内の連携',
            choice_d='他部署や外部の連携',
            next_question_a_id=6,
            next_question_b_id=6,
            next_question_c_id=6,
            next_question_d_id=6,
        )

        question5 = Question(
            question_text='今興味を持っているのはどんなことですか？',
            choice_a='自由記述',
            next_question_a_id=6,
        )

        question6 = Question(
            question_text='今の自身のキャリアのイメージは？',
            choice_a='テックリード',
            choice_b='マネジメント',
            choice_c='新技術や別分野に挑戦',
            choice_d='起業/フリーランス',
            next_question_a_id=7,
            next_question_b_id=8,
            next_question_c_id=9,
            next_question_d_id=10,
        )

        question7 = Question(
            question_text='テックリード・スペシャリストを視野に入れる中で、あなたの感覚に一番近いのは？',
            choice_a='しばらくスキルアップに努める',
            choice_b='半年以内を目処に実現したい',
            choice_c='1年以内を目処に実現したい',
            choice_d='まだふんわりしている',
            next_question_a_id=11,
            next_question_b_id=11,
            next_question_c_id=11,
            next_question_d_id=11,
        )

        question8 = Question(
            question_text='マネジメント職を視野に入れる中で、あなたの感覚に一番近いのは？',
            choice_a='体系的にマネジメントを学びたい（研修受講など）',
            choice_b='現場でノウハウを見聞きして学びたい',
            choice_c='実践的にスキルを身に付けたい（すぐにでも挑戦したい）',
            choice_d='まだふんわりしている',
            next_question_a_id=11,
            next_question_b_id=11,
            next_question_c_id=11,
            next_question_d_id=11,
        )

        question9 = Question(
            question_text='どんな技術や分野に興味がありますか？',
            choice_a='自由記述',
            next_question_a_id=11,
        )

        question10 = Question(
            question_text='それを実現するのは、どのくらい先を見据えていますか？',
            choice_a='半年以内',
            choice_b='1年以内',
            choice_c='数年',
            choice_d='まだふんわりしている',
            next_question_a_id=11,
            next_question_b_id=11,
            next_question_c_id=11,
            next_question_d_id=11,
        )

        question11 = Question(
            question_text='キャリア形成のために、現在取り組んでいることはありますか？',
            choice_a='自主学習（例: オンラインコース、読書）',
            choice_b='実務を通じたスキルアップ',
            choice_c='メンターやコーチング',
            choice_d='特に取り組んでいない',
            next_question_a_id=12,
            next_question_b_id=12,
            next_question_c_id=12,
            next_question_d_id=12,
        )

        question12 = Question(
            question_text='職場で最も大切にしている価値観は何ですか？',
            choice_a='成果',
            choice_b='誠実さ',
            choice_c='革新性',
            choice_d='信頼',
            next_question_a_id=13,
            next_question_b_id=13,
            next_question_c_id=13,
            next_question_d_id=13,
        )

        question13 = Question(
            question_text='理想の職場環境とはどのようなものですか？',
            choice_a='協力的なチーム',
            choice_b='柔軟な働き方',
            choice_c='チャレンジングな環境',
            choice_d='安定した業務',
            next_question_a_id=14,
            next_question_b_id=14,
            next_question_c_id=14,
            next_question_d_id=14,
        )

        question14 = Question(
            question_text='あなたが仕事で最もやりがいを感じるのはどんな瞬間ですか？',
            choice_a='目標を達成したとき',
            choice_b='チームで成果を上げたとき',
            choice_c='クライアントから感謝されたとき',
            choice_d='新しいスキルを習得したとき',
            next_question_a_id=15,
            next_question_b_id=15,
            next_question_c_id=15,
            next_question_d_id=15,
        )

        question15 = Question(
            question_text='どんなフィードバックを受けると、やる気が湧いてきますか？',
            choice_a='成果に対する具体評価',
            choice_b='具体的な改善点の提示',
            choice_c='ストレッチな目標の提示',
            choice_d='目標に対する客観的な進捗評価',
            next_question_a_id=16,
            next_question_b_id=16,
            next_question_c_id=16,
            next_question_d_id=16,
        )

        question16 = Question(
            question_text='自身に対するフィードバックは、どのような切り口のものがあると嬉しいですか？',
            choice_a='技術力',
            choice_b='ソフトスキル',
            choice_c='チームでの振る舞い',
            choice_d='仕事全般の進め方',
            next_question_a_id=17,
            next_question_b_id=17,
            next_question_c_id=17,
            next_question_d_id=17,
        )

        question17 = Question(
            question_text='そのフィードバックは、誰にしてほしいですか？',
            choice_a='上司',
            choice_b='チームリーダー',
            choice_c='同じポジションのメンバー',
            choice_d='違うポジションのメンバー',
            next_question_a_id=18,
            next_question_b_id=18,
            next_question_c_id=18,
            next_question_d_id=18,
        )

        question18 = Question(
            question_text='次の1on1ではどのような話題を中心に進めたいですか？',
            choice_a='キャリア',
            choice_b='技術関連',
            choice_c='ソフトスキル',
            choice_d='その他',
            next_question_a_id=19,
            next_question_b_id=19,
            next_question_c_id=19,
            next_question_d_id=19,
        )

        question19 = Question(
            question_text='次の1on1ではどんな進め方があなたに合っていますか？',
            choice_a='話を聞いてほしい',
            choice_b='アドバイスがほしい',
            choice_c='ディスカッションしたい',
            choice_d='一緒に方向性を考えてほしい',
            next_question_a_id=20,
            next_question_b_id=20,
            next_question_c_id=20,
            next_question_d_id=20,
        )

        question20 = Question(
            question_text='何か伝えておきたいこと、メモに残しておきたいことはありますか？',
            choice_a='自由記述',
        )

        db.add_all([question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12, question13, question14, question15, question16, question17, question18, question19, question20])
        db.commit()

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()



