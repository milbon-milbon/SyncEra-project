import logging
import os
import json
from dotenv import load_dotenv
from app.db.database import SessionLocal
from app.db.models import Question
from sqlalchemy.orm import Session
from app.db.models import Question
from app.services.redis_client import redis_client

# 環境変数の読み込み
load_dotenv()

# ロギングの設定
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
# slack_sdkライブラリのログレベルをINFOに設定
logging.getLogger("slack_sdk").setLevel(logging.INFO)

# 質問オブジェクトのシリアライズ（Redisに保存する）
def serialize_question(question: Question):
    logger.debug(f"◆◆serialize_question関数が呼び出されました")
    return json.dumps({
        "id": question.id,
        "question_text": question.question_text,
        "choice_a": question.choice_a,
        "choice_b": question.choice_b,
        "choice_c": question.choice_c,
        "choice_d": question.choice_d,
        "next_question_a_id": question.next_question_a_id,
        "next_question_b_id": question.next_question_b_id,
        "next_question_c_id": question.next_question_c_id,
        "next_question_d_id": question.next_question_d_id
    })

# 質問オブジェクトのデシリアライズ（キャッシュ再取得）
def deserialize_question(question_json: str):
    logger.debug(f"◆◆deserialize_question関数が呼び出されました")
    data = json.loads(question_json)
    return Question(
        id=data["id"],
        question_text=data["question_text"],
        choice_a=data["choice_a"],
        choice_b=data["choice_b"],
        choice_c=data["choice_c"],
        choice_d=data["choice_d"],
        next_question_a_id=data["next_question_a_id"],
        next_question_b_id=data["next_question_b_id"],
        next_question_c_id=data["next_question_c_id"],
        next_question_d_id=data["next_question_d_id"]
    )

# 質問キャッシュのクリア（新しい質問が追加されたとき使用）
def clear_question_cache(question_id: int):
    logger.debug(f"◆◆clear_question_cache関数が呼び出されました")
    redis_client.delete(f"question:{question_id}")