# backend/app/main.py
from fastapi import FastAPI
from app.services.stripe import router as stripe_router

app = FastAPI()

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."

# Stripeのルーターを登録
app.include_router(stripe_router)