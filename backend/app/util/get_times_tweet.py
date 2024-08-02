# from fastapi
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
# from app.database import SessionLocal
# from app.models import テーブル名

def get_times_tweet(user_id: str, start_date, end_date):
    # データベースから指定したユーザーの指定期間分のtimesの投稿データを取得する
    return "timesの投稿データ"