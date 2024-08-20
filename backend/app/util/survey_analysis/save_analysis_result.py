import os
from fastapi import Depends
from dotenv import load_dotenv
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
from datetime import date, timedelta
from app.util.survey_analysis.analysis_functions import (
    latest_response_by_user,
    latest_two_responses_by_user,
    latest_responses_by_user_in_past_year
)
from app.util.get_daily_report import get_daily_report
from app.util.get_times_tweet import get_times_tweet
from app.db.models import AnalysisResult
from app.db.database import get_db

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# アンケートは３ヶ月ごとに実施されているという前提で実装
def save_survey_result(slack_user_id: str, db: Session = Depends(get_db)):
    try:
        #___アンケート回答
        latest_result=latest_response_by_user(slack_user_id)
        latest_half_year_result=latest_two_responses_by_user(slack_user_id)
        latest_year_result=latest_responses_by_user_in_past_year(slack_user_id)

        if not latest_result:
            logger.error("◆latest_resultの取得に失敗しました")
        else:
            logger.info("◆latest_resultの取得に成功しました")

        if not latest_half_year_result:
            logger.error("◆latest_twoの取得に失敗しました")
        else:
            logger.info("◆latest_twoの取得に成功しました")
        if not latest_year_result:
            logger.error("◆ latest_year_resultの取得に失敗しました")
        else:
            logger.info("◆latest_year_resultの取得に成功しました")

        #___daily_report, times_tweetを90日分取得する
        end_date = date.today()
        start_date = end_date - timedelta(days=90)
        daily_report_90days = get_daily_report(slack_user_id, start_date, end_date)
        times_tweet_90days = get_times_tweet(slack_user_id, start_date, end_date)

        if not daily_report_90days:
            logger.error("◆daily_report_90daysの取得に失敗しました")
        else:
            logger.info("◆daily_report_90daysの取得に成功しました")
        if not times_tweet_90days:
            logger.error("◆times_tweet_90daysの取得に失敗しました")
        else:
            logger.info("◆times_tweet_90daysの取得に成功しました")

        prompt = f"""
        あなたはプロフェッショナルなキャリアアドバイザーです。
        この企業に勤めるエンジニアは3ヶ月に1度、自身のキャリアの志向に関してのアンケートに回答しています。
        その中で、あなたはその回答者たちの上司から、以下のような依頼を受けました。
        - 「最新の回答内容に加えて、経時的な回答の変化や傾向、重要だったり顕著な変化を把握したい」
        - 「毎回一つずつアンケートの結果をじっくり見る時間がなかなか取れないので力を貸して欲しい」

        以下に占める情報、条件、制約に基づき、出力してください。

        【分析の切り口】
        - 最新の回答の要約
        - 前回の回答と最新の回答の差分、変化など
        - 最新の回答を含めた直近4回分の回答から、経時的な回答の変化や傾向、重要だったり顕著な変化
        - 回答者が望むキャリアに対して実際の業務内容などは適切か（キャリアを叶えるに十分か）、または望む方向と大きな乖離がないか、等

        【参照させる外部知識、データベースなど】
        
        最新の回答 : {latest_result}
        最新と一つ前の回答(半年分） : {latest_half_year_result}
        直近1年分の回答 : {latest_year_result}
        直近90日分の日報データ : {daily_report_90days}
        直近90日分のtimesの呟きデータ : {times_tweet_90days}

        【出力フォーマット: マークダウン方式で出力すること】
        > **注目:** **最新の回答登録日: 2024年...月...日**
        ---
        ## 最新の回答の要約
        ...
        ## 前回の回答からの変化
        ...
        ## 過去1年間での回答の傾向や顕著または重要な変化
        ...
        ## 回答結果と日常(業務や様子)の分析
        ...

        【出力における条件】
        - 全ての項目において、文章を構造化し、内容は長い文章ではなくできる限り箇条書きや改行を活用して出力すること。
        - 「超多忙な人が1分でぱっと読んでアンケート回答の内容を把握できる」文章に仕上げること。
        - 出力形式はマークダウン方式で、見出しや箇条書き、番号の箇条書きなどを優先して使用することとしますが、箇条書きで表現することにより項目数がやたらと多くなってしまう場合、簡潔な文章でそれを表現できる場合には文章での出力も可とします。
        - 出力の冒頭ではまず初めに参照している最新のアンケート回答がいつ作成されたものかを明記してください。（例: [※最新の回答登録日: 2024年8月17日]
        - アンケートの回答者の性別が何であっても差し支えのない表現を用いること（彼、彼女は使用しない等）とします。
        - アンケートの回答から読み取れる「事実」と、回答から考えられる「推測」や「飛躍」が混同しないように留意してください。
        - 出力フォーマットで ## 見出しでセクションの文言を設けていますが、ニュアンスが大きくずれなければ、表現や文言を調整、変更することを許容します。
        """

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-4o-mini",
            max_tokens=5000,
            temperature=0.99999999 #調整必要、最後に。
        )

        logger.debug(f"◆latest_resultのインデックス0要素: {latest_result[0]}")

        analysis_result = response.choices[0].message.content.strip()
        logger.debug(f"◆キャリアアンケート回答の分析結果: {analysis_result}")

        # 以下のオブジェクトをDBのAnalysisResultテーブルに保存したい
        new_result = AnalysisResult(
            slack_user_id= slack_user_id,
            result=analysis_result
        )

        # 新しいレコードをデータベースに追加してコミット
        db.add(new_result)
        db.commit()
        db.refresh(new_result)

        return "分析結果をデータベースに保存しました"
    except Exception as e:
        logger.error(f"分析中または保存中のエラー: {e}")
        return f"分析中または保存中のエラー: {e}"
    

#_____関数テスト_____ 開発環境ではDockerfileでコンテナ起動時に実行ファイルに指定しているためコメントアウトしない
# slack_user_id = "U07F8NPV1RQ"
slack_user_id = 'sample_4'
db=get_db()

test_response=save_survey_result(slack_user_id, db)
print(test_response)



