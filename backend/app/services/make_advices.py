import os
from dotenv import load_dotenv
import logging
from openai import OpenAI
from app.util.get_employee_info import get_employee_info
from app.util.get_daily_report import get_daily_report
from app.util.get_times_tweet import get_times_tweet
from app.util.survey_analysis.analysis_functions import latest_response_by_user, latest_two_responses_by_user, latest_responses_by_user_in_past_year
from app.services.make_summary import make_summarize_report
from datetime import date

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_advices(slack_user_id: str, start_date: date, end_date: date):
    try:
        employee_info = get_employee_info(slack_user_id)
        daily_report = get_daily_report(slack_user_id, start_date, end_date)
        times_tweet = get_times_tweet(slack_user_id, start_date, end_date)
        summary = make_summarize_report(slack_user_id, start_date, end_date)

        if not employee_info:
            logger.error("◆user_infoの取得に失敗しました")
        else:
            logger.info("◆user_infoの取得に成功しました")

        if not daily_report:
            logger.error("◆daily_reportの取得に失敗しました")
        else:
            logger.info("◆daily_reportの取得に成功しました")

        if not times_tweet:
            logger.error("◆timesの投稿データ取得に失敗しました")
        else:
            logger.info("◆timesの投稿データ取得に成功しました")
        if not summary:
            logger.error("◆summaryの取得に失敗しました。")
        else:
            logger.info("◆summaryの取得に成功しました")

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

        prompt = f"""
        あなたは職場内コミュニケーション活性化を推進するプロフェッショナルです。
        今、あなたはある上司からアドバイスが欲しいと相談を受けています。
        その上司（=依頼主）はこれから部下と1on1を実施するようですが、なかなか部下の本音を聞き出せず、1on1が有効活用できていないと悩んでいるようです。
        本来1on1では部下が主役となり、仕事のことやキャリアのことはもちろん、公私問わず最近のことを話し上司部下の信頼関係構築や会社へのエンゲージメント向上を狙いとして実施されます。
        しかしながら、部下が話しやすい雰囲気を作ったり相手が期待するような話題の導入をするのは上司の役割だと、この依頼主は考えているようです。
        そして依頼主は、あなたに以下のことを期待しています。末尾の参考情報から、上司の期待に応えてください。
        なお出力にあたっては【条件】を参照し、厳密に則るようにしてください。

        【依頼主が期待していること】
        - 1on1を有効活用するために、上司から部下に切り出すと部下が食いついてきそうな話題や褒めるべき点、投げかけると部下の本音が聞き出せそうな質問
        - あまり硬くなりすぎず、フランクさ、フラットさも兼ね備えた会話がしたい
        - 距離を縮めてより良い信頼関係を築いていきたい
        - 褒める時には具体的なポイントをあげて褒めたい、抽象的な表現は避けたい
        - ちゃんと日報を読んでいるんだ、timesもたまに見ているんだ、と言うことを会話の中でそれとなく伝えたい（日報に書いていたよね、timeで話してたよね、など）

        【参考情報】
        - 1)部下の日報: {daily_report}
        - 2)部下のslackのtimesの呟き: {times_tweet}
        - 3)部下のプロフィール: {employee_info}
        - 4)1~3をもとに作成した要約文: {summary}
        - 5)最新のキャリアアンケートの結果: {latest_result}
        - 6)過去２回分のキャリアアンケートの結果: {latest_half_year_result}
        - 7)過去４回分のキャリアアンケートの結果: {latest_year_result}

        【条件】
        - 全ての項目において、文章を構造化し、内容は長い文章ではなくできる限り箇条書きや改行を活用して出力すること。
        - 「超多忙な人が1分でぱっと読んでアンケート回答の内容を把握できる」文章に仕上げること。
        - 出力形式はマークダウン方式で、見出しや箇条書き、番号の箇条書きなどを優先して使用することとします。マークダウンのどのような記法を使用しても構いません。とにかく見やすく読みやすく、を優先します。
        - # に続く文字はセクションタイトル（見出し）であり、Heading1 にして、適切な絵文字をつけてください。各セクションは区切り線で区切ったあと1行の改行を挟んでください。
        - セクションの中も小見出しがありますが、小見出しは太字、その後改行して文章を記載してください。（例：**キャリアのイメージ** 改行 その内容　と続ける）
        - ただし、箇条書きで表現することにより項目数がやたらと多くなってしまう場合、簡潔な文章でそれを表現できる場合には文章での出力も可とします。
        - 出力の冒頭ではまず初めに参照している日報、timesの投稿がいつの期間のものかを明記してください。
        （例: [※2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。]
        - 要約する観点ごとに文章を構造化し、内容は長い文章ではなく箇条書きや改行を活用し、超多忙な上司がパッと読んで理解しやすい出力にしてください。
        - この日報やつぶやきを書いた社員の性別は男性でも女性でも通用するような表現にしてください（彼、彼女を使わない、など）。

        【出力フォーマット例】
        **2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。**
        （区切り線を入れる）
        # ＜📍見出し＞
        **小見出し** <\n>
        内容
        （区切り線）
        <\n> 
        """

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-4o-mini",
            max_tokens=1000,
            temperature=0.7 #調整必要、最後に。
        )
        advices = response.choices[0].message.content.strip()

        logger.debug(f"◆LLMが生成した1on1のアドバイス: {advices}")

        return advices
    except Exception as e:
        return f"アドバイス生成中のエラー: {e}"
