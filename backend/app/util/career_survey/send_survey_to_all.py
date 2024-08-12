from app.db.database import get_db, SessionLocal
from app.db.models import Employee
from sqlalchemy.orm import Session
from app.db.models import Question, Employee
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import os

slack_token = os.getenv("SLACK_API_KEY")
client = WebClient(token=slack_token)

# Slackでslack_user_id指定でテキストメッセージを送る
def send_message(slack_user_id: str, text: str):
    try:
        response = client.chat_postMessage(channel=slack_user_id, text=text)
    except SlackApiError as e:
        print(f"Error sending message: {e.response['error']}")

# send/messageのロジックを利用して、社員個々にアンケートを送信する
def send_survey_to_employee(slack_user_id: str, first_question: Question):
    text = first_question.question_text
    attachments = [
        {
            "text": "選択肢を選んでください",
            "fallback": "選択肢を選んでください。",
            "callback_id": str(first_question.id),
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "answer",
                    "text": first_question.choice_a,
                    "type": "button",
                    "value": "A"
                },
                {
                    "name": "answer",
                    "text": first_question.choice_b,
                    "type": "button",
                    "value": "B"
                },
                {
                    "name": "answer",
                    "text": first_question.choice_c,
                    "type": "button",
                    "value": "C"
                },
                {
                    "name": "answer",
                    "text": first_question.choice_d,
                    "type": "button",
                    "value": "D"
                }
            ]
        }
    ]
    try:
        response = client.chat_postMessage(
            channel=slack_user_id,
            text=text,
            attachments=attachments
        )
    except SlackApiError as e:
        print(f"Error sending message: {e.response['error']}")

# 初回の質問を取得するためのヘルパー関数
# 引数: db (Session): SQLAlchemyのデータベースセッションオブジェクト。
# 戻り値: Question: データベースから取得した初回の質問オブジェクト。
def get_first_question(db: Session) -> Question:
    first_question = db.query(Question).filter(Question.id == 1).first()  # id=1 の質問を初回の質問とみなして取得
    return first_question

# DBに登録された社員全員に send_survey_to_employee 関数を適用する(=全員にアンケートを配信する)
def send_survey_to_all():
    db = SessionLocal()  # ここでDBセッションを作成
    try:
        first_question = get_first_question(db)  # 初回の質問を取得
        employees = db.query(Employee).all()
        for employee in employees:
            send_survey_to_employee(employee.slack_user_id, first_question)  # first_questionを渡す
    finally:
        db.close()  # セッションを確実に閉じる
