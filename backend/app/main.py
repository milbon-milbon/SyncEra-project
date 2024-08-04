from fastapi import FastAPI
from .services.slackApi import get_and_save_users, get_and_save_daily_report


app = FastAPI()

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."

@app.get("/users")
def read_users():
    return get_and_save_users()

@app.get("/post_daily_report")
def read_daily_report():
    return get_and_save_daily_report()