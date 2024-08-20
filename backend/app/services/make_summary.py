import os
from dotenv import load_dotenv
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
from app.util.get_employee_info import get_employee_info
from app.util.get_daily_report import get_daily_report
from app.util.get_times_tweet import get_times_tweet
from datetime import date

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_summarize_report(slack_user_id: str, start_date: date, end_date: date):
    try:
        employee_info = get_employee_info(slack_user_id)
        daily_report = get_daily_report(slack_user_id, start_date, end_date)
        times_tweet = get_times_tweet(slack_user_id, start_date, end_date)

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

        prompt = f"""
        あなたは、働く人々の残す日報やふとしたつぶやきなど、あらゆる文章を要約するのが世界一上手なプロフェッショナルです。
        今、あなたに助けを求めている依頼主がいます。
        その依頼主は部下を持つある企業のマネージャーであり、部下との1on1を実施するにあたり、1on1相手の部下日頃の様子をより詳細に把握したいと思っています。
        しかしながら依頼主自身も非常に多忙で、部下の日々の様子を把握するのに有効な部下の日報やslackのtimesに投稿される呟きをひとつひとつじっくり読む時間が取れません。
        そこで、ある特定期間の日報とslackのtimesの投稿データをもとに、あなたにこれらをポイントを絞って要約してもらいたいそうです。
        1on1前に3分で部下の日頃の様子が把握できるように、上司の期待に応える出力をしてください。
        出力ルールについては【要約文に含めるべき最低限の観点】および【条件】に則ることとし、
        参考にする情報は【参考情報】に含まれるものを使用してください。

        【要約文に含めるべき最低限の観点】
        - 1)「業務で頑張っている・挑戦していること」
        - 2)「悩んだり困っていそうなこと」
        - 3)「最近興味を持っていそうなこと」
        【参考情報】
        - 従業員の情報: {employee_info}、
        - 日報の内容: {daily_report}、
        - timesのつぶやき: {times_tweet}
        【条件】
        - 出力の冒頭ではまず初めに参照している日報、timesの投稿がいつの期間のものかを明記してください。
        （例: [※2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。]
        - 要約する観点ごとに文章を構造化し、内容は長い文章ではなく箇条書きや改行を活用し、超多忙な上司がパッと読んで理解しやすい出力にしてください。
        - この日報やつぶやきを書いた社員の性別は男性でも女性でも通用するような表現にしてください（彼、彼女を使わない、など）。

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
            temperature=0.5
        )

        summary = response.choices[0].message.content.strip()
        logger.debug(f"◆LLMが生成したサマリー: {summary}")

        return summary
    except Exception as e:
        return f"要約中のエラー: {e}"