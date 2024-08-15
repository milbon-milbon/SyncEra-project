import os
from dotenv import load_dotenv
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
# from app.database import SessionLocal
# from app.models import テーブル名
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
        以下に、メンバーの情報として user_info、そのメンバーの指定された期間分の日報として daily_report、同じくそのメンバーの指定された期間の任意のつぶやきチャンネルの内容として times があります。
        このメンバーの日報およびtimesの内容を要約しておよそ1000文字以内で出力してください。
        また、要約文の冒頭ではまず初めに参照している日報、timesの投稿がいつの期間のものかを明記してください（例: [このサマリーは、2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。]
        なお、要約する観点として以下の3つは最低限持つようにしてください。
        1)「業務で頑張っている・挑戦していること」
        2)「悩んだり困っていそうなこと」
        3)「最近興味を持っていそうなこと」
        参照する情報は以下の通り
        従業員の情報: {employee_info}、
        日報の内容: {daily_report}、
        timesのつぶやき: {times_tweet}
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


# テストするなら以下をアレンジ
# slack_user_id = "sample_4"
# start_date = date(2024, 8, 1)
# end_date = date(2024, 8, 20)
# summary = make_summarize_report(slack_user_id, start_date, end_date)
# print(summary)