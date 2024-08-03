from fastapi import FastAPI
from .services.slackApi import get_daily_report

app = FastAPI()

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."

@app.get("/daily_report")
def read_daily_report():
    return get_daily_report()



