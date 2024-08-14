import os
from dotenv import load_dotenv
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
from datetime import date
from app.util.survey_analysis.analysis_functions import (
    filtered_by_slack_user_id_analysis,
    filtered_by_user_and_date,
    latest_response_by_user,
    latest_two_responses_by_user,
    latest_responses_by_user_in_past_year
)

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# アンケートは３ヶ月ごとに実施されているという前提で実装
def make_survey_result_by_date(slack_user_id: str, date: date):
    try:
        response_by_date=filtered_by_user_and_date(slack_user_id, date)

        if not response_by_date:
            logger.error("◆response_by_dateの取得に失敗しました")
        else:
            logger.info("◆response_by_dateの取得に成功しました")

        prompt = f"""
        指定された日付の回答結果を表示する。
        フォーマットは要調整。
        以下のアンケートの回答結果をいい感じに簡潔に説明してください。
        箇条書きなどもつきながら構造化されていると最高です。
        {response_by_date}
        【出力フォーマット】
        ・・・・
        ・・・・
        ・・・・
        【出力例】
        ・・・・
        ・・・・
        ・・・・
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
