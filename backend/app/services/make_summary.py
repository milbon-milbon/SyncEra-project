# from fastapi
import os
from dotenv import load_dotenv
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
# from app.database import SessionLocal
# from app.models import テーブル名
from util.get_user_info import get_user_info
from util.get_daily_report import get_daily_report
from util.get_times_tweet import get_times_tweet

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def make_summarize_report(user_id, start_date, end_date):
    try:
        user_info = get_user_info(user_id)
        daily_report = get_daily_report(user_id, start_date, end_date)
        times_tweet = get_times_tweet(user_id, start_date, end_date)

        prompt = f"""
        以下に、メンバーの情報として user_info、そのメンバーの指定された期間分の日報として daily_report、同じくそのメンバーの指定された期間の任意のつぶやきチャンネルの内容として times があります。
        このメンバーの日報およびtimesの内容を要約しておよそ1000文字以内で出力してください。
        なお、要約する観点として以下の3つは最低限持つようにしてください。
        1)「業務で頑張っている・挑戦していること」
        2)「悩んだり困っていそうなこと」
        3)「最近興味を持っていそうなこと」
        参照する情報は以下の通り
        従業員の情報: {user_info}、
        日報の内容: {daily_report}、
        timesのつぶやき: {times_tweet}
        """

        response = client.Completion.create(
            model="gpt-4", #gpt4o-miniでもいいかも
            prompt=prompt,
            max_tokens=1000,
            temperature=0.5, #可変部
        )

        summary = response.choices[0].text.strip()

        return summary
    except Exception:
        return f"要約中のエラー: {Exception}"


# テストするなら以下をアレンジ
if __name__ == "__main__":
    user_id = 1
    start_date = "2024-07-29"
    end_date = "2024-08-2"
    summary = make_summarize_report(user_id, start_date, end_date)
    print(summary)