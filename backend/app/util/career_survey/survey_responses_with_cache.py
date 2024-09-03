import os
from dotenv import load_dotenv
import logging
from app.services.redis_client import redis_client
from sqlalchemy.orm import Session
from app.db.models import UserResponse

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# キャリアアンケートの回答をキャッシュに保存する関数
def store_user_response_temporarily(user_id: str, question_id: int, answer: str):
    logger.info(f"◆◆{user_id}のキャリアアンケートの回答をキャッシュに保存しました")
    redis_client.hset(f"user_response:{user_id}", question_id, answer)


# キャッシュに保存されたキャリアアンケートの回答をデータベースに保存する関数
def save_responses_to_db(user_id: str, db: Session):
    responses = redis_client.hgetall(f"user_response:{user_id}")
    for question_id, answer in responses.items():
        answer = answer.decode('utf-8') if isinstance(answer, bytes) else answer
        # answerの内容が自由記述（free_text）であるかを確認し、回答内容に応じて処理
        if isinstance(answer, dict) and 'free_text' in answer:
            free_text = answer['free_text']
            answer = answer.get('selected_option', '')  # 選択肢があればそれを使用、なければ空文字
        else:
            free_text = None
        
        new_response = UserResponse(
            slack_user_id=user_id, 
            question_id=int(question_id), 
            answer=answer,
            free_text=free_text
        )
        db.add(new_response)
    db.commit()
    logger.info(f"◆◆{user_id}のキャリアアンケートの回答をデータベースに保存しました")
    redis_client.delete(f"user_response:{user_id}")
    logger.info(f"◆◆{user_id}のキャリアアンケートの回答をキャッシュから削除しました")