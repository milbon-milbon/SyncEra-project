from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.make_summary import make_summarize_report
from app.services.make_advices import make_advices
from app.services.make_employee_list import make_employee_list
from app.util.add_employee_info import add_employee
from app.util.get_latest_daily_report import get_latest_daily_report
from app.db.models import Employee, SlackUserInfo, DailyReport
from app.db.database import get_db 
from app.db.schemas import Employee, EmployeeCreate
from app.util.get_employee_info import get_employee_info
from app.util import convert_ts_to_date
from typing import Optional
from datetime import date

router = APIRouter()

#-------------社員情報-------------

# 社員情報の登録
@router.post("/add_employee_info/", response_model=Employee)
def add_employee_info(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return add_employee(db=db, employee=employee)

# 社員の一覧画表示のリクエストがあった時 データのGET,OK
@router.get("/all_employee/")
def get_all_employee():
    return make_employee_list()

## 特定社員の情報表示のリクエストがあった時 データのGET,OK
@router.get("/selected_employee/{slack_user_id}/")
def get_selected_member(slack_user_id: str):
    employee_detail = get_employee_info(slack_user_id)[0]
    latest_daily_report = get_latest_daily_report(slack_user_id)
    if employee_detail and latest_daily_report:
        return employee_detail,latest_daily_report
    else:
        raise HTTPException(status_code=404, detail="指定されたメンバーが見つかりません")

#-------------日報サマリー-------------

# 日報サマリーをLLMから出力する
@router.get("/print_summary/{slack_user_id}/")
def print_summary(slack_user_id:str, start_date: date, end_date: date):
    return make_summarize_report(slack_user_id, start_date, end_date)

# LLMが生成した日報サマリーをDBに保存する
@router.post("/save_summary_report/{employee_id}/")
def save_summary_report(employee_id: str, summary_report: str):
    return "処理未実装"

# 保存された全ての日報サマリーをDBから出力する
@router.get("/print_all_summary_reports/{employee_id}/")
def print_all_summary_reports(employee_is: str):
    return "処理未実装"

# 保存された特定の日報サマリーをDBから出力する
@router.get("/print_saved_summary_report/{employee_id}/")
def print_saved_summary_report(employee_id: str, created_st: date):
    return "処理未実装"

#-------------1on1アドバイス-------------

# 1on1アドバイス/質問をLLMから出力する
@router.get("/print_advices/{slack_user_id}/")
def print_advice(slack_user_id:str, start_date: date, end_date: date):
    return make_advices(slack_user_id, start_date, end_date)

# LLMが生成した1on1アドバイスをDBに保存する
@router.post("/save_advice/{employee_id}/")
def save_advice(employee_id: str, advice: str):
    return "処理未実装"

# 保存された全ての1on1アドバイスをDBから出力する
@router.get("/print_all_advices/{employee_id}/")
def print_all_advices(employee_id: str):
    return "処理未実装"

# 保存された特定の1on1アドバイスをDBから出力する
@router.get("/print_saved_advice/{employee_id}/")
def print_saved_advice(employee_id: str, created_at: date):
    return "処理未実装"

#-------------キャリアアンケート-------------

# 特定のキャリアアンケート結果をDBから出力する
@router.get("/print_career_survey_result/{employee_id}/")
def print_career_survey_result(employee_id: str, created_at: date):
    return "処理未実装"

#実施済みのキャリアアンケート結果を全て取出力する
@router.get("/print_all_career_survey_results/{employee_id}/")
def print_all_career_survey_results(employee_id: str):
    return "処理未実装"







