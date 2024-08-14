from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.services.make_summary import make_summarize_report
from app.services.make_advices import make_advices
from app.services.make_employee_list import make_employee_list
from app.services.make_analysis_results_list import make_analysis_results_list
from app.util.add_employee_info import add_employee
from app.util.get_latest_daily_report import get_latest_daily_report
from app.db.models import Employee, SlackUserInfo, DailyReport, AnalysisResult
from app.db.database import get_db 
from app.db.schemas import Employee, EmployeeCreate, SummaryReportRequest, SavedSummaryReport, AdvicesRequest, SavedAdvices
from app.util.get_employee_info import get_employee_info
from app.util.summary.save_summary_report import save_summary_report
from app.util.summary.get_saved_summarize_history import get_saved_summary_report
from app.util.advices.save_advices import save_advices
from app.util.advices.get_all_saved_advices_history import get_all_saved_advices_history
from app.util.advices.get_saved_advices_history import get_saved_advices_history
from app.util.summary.get_all_saved_summarize_history import get_all_saved_summary_reports
from app.util import convert_ts_to_date
from app.util.survey_analysis.analysis_functions import filtered_by_user_and_date
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
@router.post("/save_summary_report/")
def save_summary_report(report: SummaryReportRequest, db: Session=Depends(get_db)): # 引数は/save_adviceと同じロジック
    # 返り値: uti.save_summary_reports.tsを参照
    return save_summary_report(report, db)

# 保存された全ての日報サマリーをDBから出力する
@router.get("/print_all_summary_reports/{employee_id}/", response_model=list[SavedSummaryReport])
def print_all_summary_reports(employee_id: str, db: Session=Depends(get_db)):
    # 返り値: util.summary.get_all_saved_summarize_history.pyを参照
    return get_all_saved_summary_reports(employee_id, db)

# 保存された特定の日報サマリーをDBから出力する
@router.get("/print_saved_summary_report/{employee_id}/", response_model=SavedSummaryReport)
def print_saved_summary_report(employee_id: str, created_at: date=Query(...), db: Session=Depends(get_db)):
    # 返り値: util.summary.get_saved_summarize_history.pyを参照
    return get_saved_summary_report(employee_id, created_at, db)

#-------------1on1アドバイス-------------

# 1on1アドバイス/質問をLLMから出力する
@router.get("/print_advices/{slack_user_id}/")
def print_advice(slack_user_id:str, start_date: date, end_date: date):
    # 参照: app.services.make_advices.py
    return make_advices(slack_user_id, start_date, end_date)

# LLMが生成した1on1アドバイスをDBに保存する
@router.post("/save_advice/")
def save_advice(advices: AdvicesRequest, db: Session=Depends(get_db)):
    # 参照: app.util.advices.save_advices.py
    return save_advices(advices, db)

# 保存された全ての1on1アドバイスをDBから出力する
@router.get("/print_all_advices/{employee_id}/", response_model=list[SavedAdvices])
def print_all_advices(employee_id: str, db: Session=Depends(get_db)):
    # 参照: app.util.advices.get_all_saved_advices_history.py
    return get_all_saved_advices_history(employee_id, db)

# 保存された特定の1on1アドバイスをDBから出力する
@router.get("/print_saved_advice/{employee_id}/", response_model=SavedAdvices)
def print_saved_advice(employee_id: str, created_at: date, db):
    # 参照: app.util.advices.get_saved_advices_history.py
    return get_saved_advices_history(employee_id, created_at, db)

#-------------キャリアアンケート-------------
#指定したユーザーの、全てのアンケート分析結果を取得する
@router.get("/print_all_career_survey_results/{slack_user_id}/")
def print_all_career_survey_results(slack_user_id: str, db: Session=Depends(get_db)):
    return make_analysis_results_list(slack_user_id, db)







