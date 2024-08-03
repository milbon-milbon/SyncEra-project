from fastapi import APIRouter
from app.services.make_summary import make_summarize_report
from app.services.make_advices import make_advices
from app.services.make_member_list import make_members_list

router = APIRouter()

# 社員の一覧画表示のリクエストがあった時
@router.get("/all_members/")
def get_all_members():
    return make_members_list()

## 特定社員の情報表示のリクエストがあった時 
@router.get("/selected_member/:user_id/")
def get_selected_member(user_id):
    return f"{user_id}で指定された社員情報を表示する(詳細情報に何を盛り込めばいいか？)"

# サマリー出力リクエストがあった時
@router.get("/print_summary/:user_id/")
def print_summary(user_id:str, start_data, end_data):
    return make_summarize_report(user_id, start_data, end_data)

# サマリーに基づいたアドバイス/質問出力リクエストがあった時
@router.get("/print_summarize/:user_id/")
def print_advice(user_id:str, start_data, end_data):
    return make_advices(user_id, start_data, end_data)

# キャリアアンケート結果の出力リクエストがあった時
@router.get("/print_career_survey_result/:user_id/")
def print_career_survey_result(user_id: str):
    return "処理なども全て未実装、随時ここは追記していく"
