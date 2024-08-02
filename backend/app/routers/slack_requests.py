from fastapi import APIRouter

router = APIRouter()

@router.get("/エンドポイント名/")
def 関数名():
    return "何を返そうか"

# 日報が投稿された時　`POST /post_daily_report`　`by Slack`
# timesに投稿があった時 `POST /post_times` 　`by Slack`
# キャリアアンケート実施のリクエストがあった時　GET or POST /execution_career_survey by Slack
# キャリアアンケートの回答が提出された時 POST /post_career_survey　by Slack