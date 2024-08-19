import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import (
    Employee,
    TimesList,
    Question
)
from sqlalchemy.exc import SQLAlchemyError

# さよこさんへ
# このスクリプロファイルが実行されるときに、slackに自動でtimesか何かを投稿するスクリプトを組み込みたいな、
# そうしたら、それをトリガーにして、slack_user_infoテーブルにデータが自動で入るはず！
# それができれば、以下のseedingも続けて自動で実行できるはず。また相談させてね！ meme 8/9

# めめさんへ
# backend/app/util/post_slack_message.py にdaily_reportチャンネルに投稿する関数とsayoko_timesに投稿される関数を作リました
# これに伴って、環境変数を追記しています
# また組み込み方を相談させてね！　sayoko 8/14

def seed_data():
    db: Session = SessionLocal()

    try:
        '''>>> channel'''

        times_list_1 = TimesList(
            slack_user_id='U07FFA7AW1H',
            channel_name='times_ku-min',
            channel_id='C07FMU0BWCB'
        )

        times_list_2 = TimesList(
            slack_user_id='U07F8NPV1RQ',
            channel_name='times_meme',
            channel_id='C07FQFWD3U4'
        )

        times_list_3 = TimesList(
            slack_user_id='U07FCGJ9SLD',
            channel_name='times_3',
            channel_id='C07GAR3EDKJ'
        )

        times_list_4 = TimesList(
            slack_user_id='U07F0T502G6',
            channel_name='times_sayoko',
            channel_id='C07FFAX467M'
        )

        db.add_all([times_list_1, times_list_2, times_list_3, times_list_4])
        db.commit()

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



        '''
        キャリアアンケート設問、回答選択肢
        '''

        question1 = Question(
            question_text="メッセージの確認、ありがとうございます！アンケートの回答を始めますか？",
            choice_a="始める",
            # choice_b="青",
            # choice_c="緑",
            # choice_d="黄色",
            next_question_a_id=2,
            # next_question_b_id=2,
            # next_question_c_id=2,
            # next_question_d_id=2,
        )

        question2 = Question(
            question_text='現在のあなたの職務内容やポジションについて、どのように感じていますか？',
            choice_a='ちょうど良い',
            choice_b='やや負担が大きい',
            choice_c='もっと幅を広げたい',
            choice_d='違うポジションや業務に興味がある',
            next_question_a_id=3,
            next_question_b_id=4,
            next_question_c_id=3,
            next_question_d_id=5,
        )

        question3 = Question(
            question_text='これから、どのようにあなた自身を成長させていきたいですか？',
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
            choice_a='タスクが多量や高難易度',
            choice_b='メンバー育成やマネジメント',
            choice_c='部署内の連携',
            choice_d='他部署や外部連携',
            next_question_a_id=6,
            next_question_b_id=6,
            next_question_c_id=6,
            next_question_d_id=6,
        )

        question5 = Question(
            question_text='今興味を持っているのはどんなことですか？',
            choice_a='自由記述',
            # choice_b='',
            # choice_c='',
            # choice_d='',
            next_question_a_id=6,
            # next_question_b_id=,
            # next_question_c_id=,
            # next_question_d_id=,
        )

        question6 = Question(
            question_text='今あなたのキャリアのイメージは？',
            choice_a='テックリード',
            choice_b='マネジメント',
            choice_c='新技術や別分野に挑戦',
            choice_d='起業、フリーランス',
            next_question_a_id=7,
            next_question_b_id=8,
            next_question_c_id=9,
            next_question_d_id=10,
        )

        question7 = Question(
            question_text='テックリード(スペシャリスト)を視野に入れる中で、今のあなたの感覚に一番近いのは？',
            choice_a='まずはスキルアップに努める',
            choice_b='約1年以内に実現したい',
            choice_c='2~3年以内に実したい',
            choice_d='まだふんわりしている',
            next_question_a_id=11,
            next_question_b_id=11,
            next_question_c_id=11,
            next_question_d_id=11,
        )

        question8 = Question(
            question_text='マネジメント職を視野に入れる中で、あなたの感覚に一番近いのは？',
            choice_a='体系的にマネジメントを学びたい',
            choice_b='現場でノウハウを見聞きして学びたい',
            choice_c='実践でスキルを身に付けたい',
            choice_d='まだふんわりしている',
            next_question_a_id=11,
            next_question_b_id=11,
            next_question_c_id=11,
            next_question_d_id=11,
        )

        question9 = Question(
            question_text='どんな技術や分野に興味がありますか？',
            choice_a='自由記述',
            # choice_b='',
            # choice_c='',
            # choice_d='',
            next_question_a_id=11,
            # next_question_b_id=,
            # next_question_c_id=,
            # next_question_d_id=,
        )

        question10 = Question(
            question_text='それを実現するのは、どのくらい先を見据えていますか？',
            choice_a='半年くらい',
            choice_b='1年くらい',
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

        db.add_all([
            question1, question2, question3, question4, question5, question6,
            question7, question8, question9, question10, question11, question12,
            question13, question14, question15, question16, question17, question18,
            question19, question20
        ])
        db.commit()

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
