from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.make_summary import make_summarize_report
from app.services.make_advices import make_advices
from app.services.make_employee_list import make_employee_list
from app.util.add_employee_info import add_employee
from app.db.models import Employee, SlackUserInfo, DailyReport
from app.db.database import get_db 
from app.db.schemas import Employee, EmployeeCreate
from app.util.get_employee_info import get_employee_info

router = APIRouter()

# 社員情報の登録
@router.post("/add_employee_info/", response_model=Employee)
def add_employee_info(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return add_employee(db=db, employee=employee)

# 社員の一覧画表示のリクエストがあった時 データのGET,OK
@router.get("/all_employee/")
def get_all_employee():
    return make_employee_list()

## 特定社員の情報表示のリクエストがあった時 データのGET,OK
@router.get("/selected_member/{user_id}/")
def get_selected_member(user_id: str):
    response = get_employee_info(user_id)
    if response:
        return response
    else:
        raise HTTPException(status_code=404, detail="指定されたメンバーが見つかりません")

# サマリー出力リクエストがあった時 #エンドポイント稼働確認はOK,start_data/end_dataをどう渡すか？
@router.get("/print_summary/{user_id}/")
def print_summary(user_id:str, start_data, end_data):
    return make_summarize_report(user_id, start_data, end_data)

# サマリーに基づいたアドバイス/質問出力リクエストがあった時 #エンドポイント稼働確認はOK,start_data/end_dataをどう渡すか？
@router.get("/print_advices/{user_id}/")
def print_advice(user_id:str, start_data, end_data):
    return make_advices(user_id, start_data, end_data)

# キャリアアンケート結果の出力リクエストがあった時 エンドポイント稼働確認OK
@router.get("/print_career_survey_result/{user_id}/")
def print_career_survey_result(user_id: str):
    return "処理なども全て未実装、随時ここは追記していく"
