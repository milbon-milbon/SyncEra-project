from app.db.database import get_db
from app.db.models import Employee
from sqlalchemy.orm import Session
from app.db.models import Question, Employee
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os

slack_token = os.getenv("SLACK_API_KEY")
client = WebClient(token=slack_token)

# Slackでslack_user_id指定でテキストメッセージを送る
def send_message(user_id: str, text: str):
    try:
        response = client.chat_postMessage(channel=user_id, text=text)
    except SlackApiError as e:
        print(f"Error sending message: {e.response['error']}")

# send/messageのロジックを利用して、社員個々にアンケートを送信する
def send_survey_to_employee(employee_id: int, db: Session):
    first_question = db.query(Question).first()
    if first_question:
        send_message(user_id=employee_id, text=first_question.question_text)

# DBに登録された社員全員に send_survey_to_employee 関数を適用する(=全員にアンケートを配信する)
def send_survey_to_all():
    db = get_db()
    employees = db.query(Employee).all()
    for employee in employees:
        send_survey_to_employee(employee.slack_user_id, db)
