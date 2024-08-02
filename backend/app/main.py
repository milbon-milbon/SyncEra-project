from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return "we are SyncEra. member: mikiko, sayoko, ku-min, meme."
