import logging
import os
import json
from dotenv import load_dotenv
from redis import Redis
from app.db.models import Question

# 環境変数の読み込み
load_dotenv()

# Redisクライアントの設定
REDIS_HOST = os.getenv("REDIS_HOST", "redis") # "redis"部分はコンテナでの開発時。ローカルの時はlocalhost
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT)

# 質問オブジェクトのシリアライズ（Redisに保存する）
def serialize_question(question: Question):
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
    redis_client.delete(f"question:{question_id}")
