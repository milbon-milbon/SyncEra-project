# import logging
# import os
# from dotenv import load_dotenv
# from sqlalchemy.orm import Session
# # from app.database import SessionLocal
# # from app.models import テーブル名

# load_dotenv()

# log_level = os.getenv("LOG_LEVEL", "INFO").upper()
# logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # データベースセッションの取得：データベースの操作を行うためのセッション
# SessionLocal = "DB設定終わったらimportのコメントアウトを解除する" #この行の削除を忘れないように
# def get_db_session() -> Session:
#     return SessionLocal()

# # すべての従業員の情報を取得する
# def get_all_members():
#     # データベースからuser情報を取得してくる
#     db = get_db_session()
#     try:
#         all_members = db.query(テーブル名).all()
#         logger.debug(f"◆DBから全ての従業員の情報を取得できました。")
#         return all_members
#     except Exception:
#         logger.error(f"◆従業員の情報を取得中にエラーが発生しました。: {Exception}")
#         return[]
#     finally:
#         db.close()    

# # 取得したデータを通常の文字列に変換する必要がある場合は以下の処理を加える。
# def compile_all_members_info():
#     pre_all_members_info = get_all_members()

#     # 会話履歴を文字列に変換
#     if not pre_all_members_info:
#         logger.info("◆文字列に変換しようとしている従業員情報が見つかりません。")
#         compiled_all_members_info = "変換したい従業員の情報がありません。"
#     else:
#         compiled_all_members_info = "必要に応じてここに出力形式を整える処理を追加する"
#         logger.debug(f"◆指定ユーザーの情報を読解可能な文字列に変換しました。")
    
#     return compiled_all_members_info
