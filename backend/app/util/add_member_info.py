import logging
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# from . import models, schemas
# from .database import SessionLocal, engine

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# データベースセッションの取得(1)
SessionLocal = "DB設定終わったらimportのコメントアウトを解除する" #この行の削除を忘れないように
def get_db_session() -> Session:
    return SessionLocal()

# データベースセッションの取得(2) １とどっちがいいのか..？
def get_db_session() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ルーターの定義
router = APIRouter()

# 新しい従業員をデータベースに登録する関数
# def add_member(db: Session, member: schemas.MemberCreate): # schemaは未定義
#     db = get_db_session() #セッション取得方法が２の場合はここは削除
#     try:
#         db_member = models.Member(name=member.name, email=member.email, position=member.position) # カラム名 = 引数に渡す登録データ.項目
#         db.add(db_member)
#         db.commit()
#         db.refresh(db_member)
#         logger.debug(f"◆新しい従業員がデータベースに登録されました: {db_member.name}")
#         return db_member
#     except Exception as e:
#         logger.error(f"◆従業員の登録中にエラーが発生しました。: {str(e)}")
#         db.rollback()
#         raise HTTPException(status_code=400, detail="◆従業員の登録に失敗しました")

def add_member():
    return "DB設計後に実際のコードのコメントアウトを解除する"