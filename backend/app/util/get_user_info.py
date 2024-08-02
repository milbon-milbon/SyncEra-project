# from fastapi
import logging
from sqlalchemy.orm import Session
from openai import OpenAI
# from app.database import SessionLocal
# from app.models import テーブル名

# 特定の従業員の情報を取得する
def get_user_info(user_id: str):
    # データベースからuser情報を取得してくる
    return "従業員のプロフィール"