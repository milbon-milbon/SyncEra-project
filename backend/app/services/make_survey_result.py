import os
from dotenv import load_dotenv
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
from datetime import date
from app.util.survey_analysis.analysis_functions import latest_months_responses_by_user, latest_two_responses_by_user

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_survey_result(slack_user_id: str, start_date: date, end_date: date):
    try:
        latest_result=latest_months_responses_by_user(slack_user_id, 1) #最新のものだけ抽出
        latest_two=latest_two_responses_by_user(slack_user_id) #最新とその一つ前を抽出

        if not latest_result:
            logger.error("◆latest_resultの取得に失敗しました")
        else:
            logger.info("◆latest_resultの取得に成功しました")

        if not latest_two:
            logger.error("◆latest_twoの取得に失敗しました")
        else:
            logger.info("◆latest_twoの取得に成功しました")

        prompt = f"""
        最新の回答の結果表示
        最新の回答の要約と、前回の回答からの差分を把握した上での分析結果を出力させる
        このとき、日報やtimesの情報を噛ませても面白いかも？
        => 実際の業務でその回答を裏付けるものや、逆に乖離が大きく希望するキャリアに反する業務ばかりになっていないか？等
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

        analysis_result = response.choices[0].message.content.strip()
        logger.debug(f"◆キャリアアンケート回答の分析結果: {analysis_result}")

        return analysis_result
    except Exception as e:
        return f"要約中のエラー: {e}"


# テストするなら以下をアレンジ
# if __name__ == "__main__":
#     slack_user_id = "slack_user_sample_1"
#     start_date = date(2024, 8, 1)
#     end_date = date(2024, 8, 7)
#     summary = make_summarize_report(slack_user_id, start_date, end_date)
#     print(summary)