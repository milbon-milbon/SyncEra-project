# redis_client.py
import os
from redis import Redis
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

# redisの接続設定
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))


redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT)

