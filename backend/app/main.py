
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

@app.get("/selected_employee/{slack_user_id}")
def get_employee_info(slack_user_id: str):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # 社員情報の取得
        cur.execute("""
            SELECT department, id, project, name, email, role, slack_user_id
            FROM employee
            WHERE slack_user_id = %s
        """, (slack_user_id,))
        employee_info = cur.fetchone()
        
        if not employee_info:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # 最新の日報データの取得
        cur.execute("""
            SELECT text, ts, id, user_id
            FROM daily_report
            WHERE user_id = %s
            ORDER BY ts DESC
            LIMIT 1
        """, (slack_user_id,))
        daily_report = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return [employee_info, daily_report]
    
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    

