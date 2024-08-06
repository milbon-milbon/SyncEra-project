
# import logging
# import os
# from dotenv import load_dotenv
# from fastapi import FastAPI
# from .routers import frontend_requests, slack_requests

# load_dotenv()

# log_level = os.getenv("LOG_LEVEL", "INFO").upper()
# logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# app = FastAPI()

# app.include_router(frontend_requests.router, prefix="/client", tags=["client"])
# app.include_router(slack_requests.router, prefix="/slack", tags=["slack"])

# @app.get("/")
# def read_root():
#     return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."


import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 追加
from .routers import frontend_requests, slack_requests

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],  # フロントエンドのURLを指定
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

app.include_router(frontend_requests.router, prefix="/client", tags=["client"])
app.include_router(slack_requests.router, prefix="/slack", tags=["slack"])

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."