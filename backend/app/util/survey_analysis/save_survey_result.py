import os
from fastapi import APIRouter, HTTPException, Depends
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
        最新の回答の結果表示
        最新の回答の要約と、前回の回答からの差分を把握した上での分析結果を出力させる
        1年分の回答を集計し、回答の傾向推移と、顕著な変化、重要な変化などを出力させる
        このとき、日報やtimesの情報を噛ませても面白いかも？
        => 実際の業務でその回答を裏付けるものや、逆に乖離が大きく希望するキャリアに反する業務ばかりになっていないか？等
        【参照させる外部知識、データベースなど】
        最新の回答 : {latest_result}
        最新と一つ前の回答(半年分） : {latest_half_year_result}
        直近1年分の回答 : {latest_year_result}
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

        # 以下のオブジェクトをDBのAnalysisResultテーブルに保存したい
        new_result = AnalysisResult(
            slack_user_id= latest_result[0].slack_user_id,
            result=analysis_result,
            save_date=latest_result[0].created_at.date()
        )

        # 新しいレコードをデータベースに追加してコミット
        db.add(new_result)
        db.commit()
        db.refresh(new_result)

        return "分析結果をデータベースに保存しました"
    except Exception as e:
        logger.error(f"分析中または保存中のエラー: {e}")
        return f"分析中または保存中のエラー: {e}"




