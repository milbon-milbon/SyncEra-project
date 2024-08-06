import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from .routers import frontend_requests, slack_requests

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(frontend_requests.router, prefix="/client", tags=["client"])
app.include_router(slack_requests.router, prefix="/slack", tags=["slack"])

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."
