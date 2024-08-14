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
from app.services.make_summary import make_summarize_report
from datetime import date

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_advices(slack_user_id: str, start_date: date, end_date: date):
    try:
        employee_info = get_employee_info(slack_user_id) # 引数で受け取るかクエリで取得するか
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

        prompt = f"""
        あなたは職場内コミュニケーション活性化を推進するプロフェッショナルです。
        今、あなたはある上司からアドバイスが欲しいと相談を受けています。
        その上司はこれから部下と1on1を実施するようですが、なかなか部下の本音を聞き出せず、1on1が有効活用できていないと悩んでいるようです。
        本来1on1では部下が主役となり、仕事のことやキャリアのことはもちろん、公私問わず最近のことを話し上司部下の信頼関係構築や会社へのエンゲージメント向上を狙いとして実施されます。
        この上司は、あなたに以下のことを期待しています。末尾の参考情報から、上司の期待に応えてください。
        【期待していること】1on1を有効活用するために、上司から部下に切り出すと部下が食いついてきそうな話題や褒めるべき点、投げかけると部下の本音が聞き出せそうな質問
        【参考情報】
        1)部下の日報: {daily_report}
        2)部下のslackのtimesの呟き: {times_tweet}
        3)部下のプロフィール: {employee_info}
        4)1~3をもとに作成した要約文: {summary}
        なお、出力の冒頭ではまず初めに参照している日報、timesの投稿がいつの期間のものかを明記してください。
        （例: [※2024年8月1日~2024年8月7日までのdaily_reportおよびtimesの投稿をもとにしています。]
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

        advices = response.choices[0].message.content.strip()

        logger.debug(f"◆LLMが生成した1on1のアドバイス: {advices}")

        return advices
    except Exception as e:
        return f"アドバイス生成中のエラー: {e}"


# テストするなら以下をアレンジ
if __name__ == "__main__":
    slack_user_id = "slack_user_sample_2"
    start_date = date(2024, 8, 1)
    end_date = date(2024, 8, 7)
    advices = make_advices(slack_user_id, start_date, end_date)
    print(advices)