import os
from dotenv import load_dotenv
import logging
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
        - 全ての項目において、文章を構造化し、内容は長い文章ではなくできる限り箇条書きや改行を活用して出力すること。
        - 「超多忙な人が1分でぱっと読んでアンケート回答の内容を把握できる」文章に仕上げること。
        - 出力形式はマークダウン方式で、見出しや箇条書き、番号の箇条書きなどを優先して使用することとします。マークダウンのどのような記法を使用しても構いません。とにかく見やすく読みやすく、を優先します。
        - ただし、箇条書きで表現することにより項目数がやたらと多くなってしまう場合、簡潔な文章でそれを表現できる場合には文章での出力も可とします。
        - 出力の冒頭ではまず初めに参照している日報、timesの投稿がいつの期間のものかを明記してください。（例: [※2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。]
        - 要約する観点ごとに文章を構造化し、内容は長い文章ではなく箇条書きや改行を活用し、超多忙な上司がパッと読んで理解しやすい出力にしてください。
        - しかし、もしかしたらじっくり読める時間があるかもしれないので、要約に加えてそれを捕捉するような「時間があったら参照してほしいその他の情報」をぜひ付け加えてください。ここでは文章良が増えたり情報量が多いことを許容する。
        - この日報やつぶやきを書いた社員の性別は男性でも女性でも通用するような表現にしてください（彼、彼女を使わない、など）。

        【出力フォーマット例】
        > **注目:** **2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。**
        ---
        ## 業務で頑張っている・挑戦していること
        ...(ここに箇条書きや文章などの内容が入る)
        ## 悩んだり困っていそうなこと
        ...(同上)
        ## 最近興味を持っていそうなこと
        ...(同上)

        ### 時間があったら参照してほしいその他の情報

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
            temperature=0.778899 #調整必要、最後に。
        )
        print(f"ここからプロンプト：{prompt}")
        summary = response.choices[0].message.content.strip()
        logger.debug(f"◆LLMが生成したサマリー: {summary}")

        return summary
    except Exception as e:
        return f"要約中のエラー: {e}"

#___
# slack_user_id = 'sample_4'
# start_date = date(2024, 7, 1)
# end_date = date(2024, 8, 30)
# summary = make_summarize_report(slack_user_id, start_date, end_date)
# print(summary)

