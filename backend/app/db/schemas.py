from pydantic import BaseModel
from typing import Optional
from datetime import datetime

'''
社員一覧にSlackのアイコンを表示するためのロジック用
'''
class SlackUserInfo(BaseModel):
    id: str
    name: str
    real_name: str
    image_512: Optional[str] = None

    class Config:
        orm_mode = True

'''
従業員情報をAPIレスポンスに乗せる用
'''
# 基本のスキーマ
class EmployeeBase(BaseModel):
    name: str
    email: str
    department: str
    role: str
    project: str

# 新しい従業員の作成用スキーマ
class EmployeeCreate(EmployeeBase):
    pass

# 部分的な更新用のスキーマ
class EmployeeUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    department: Optional[str]
    role: Optional[str]
    project: Optional[str]

    class Config:
        orm_mode = True

# データベースから取得した従業員情報のスキーマ
class Employee(EmployeeBase):
    id: int  # IDはint型が一般的です（データベース依存）
    slack_user_id: Optional[str] = None  # Slack IDはオプショナルに設定
    slack_user_info: Optional['SlackUserInfo'] = None  # Slackの追加情報

    class Config:
        orm_mode = True

'''
日報サマリーのDB保存ロジック用
'''
class SummaryReportRequest(BaseModel):
    slack_user_id: str  # employee_idはUUIDの文字列形式
    summary: str

'''
保存済みサマリーデータの出力用
'''
class SavedSummaryReport(BaseModel):
    id: int
    slack_user_id: str
    summary: str
    created_at: datetime

    class Config:
        orm_mode = True

'''
1on1アドバイスデータのDB保存ロジック用
'''
class AdvicesRequest(BaseModel):
    slack_user_id: str  # employee_idはUUIDの文字列形式
    advices: str

'''
保存済み1on1アドバイス履歴の出力用
'''
class SavedAdvices(BaseModel):
    id: int
    slack_user_id: str
    advices: str
    created_at: datetime

    class Config:
        orm_mode = True

'''
問い合わせフォームの内容をAPIレスポンスに乗せる用
'''
class ContactFormBase(BaseModel):
    company_name: str  # 追加
    department: Optional[str] = None  # 追加（任意項目）
    name: str
    email: str
    message: str

class ContactFormCreate(ContactFormBase):
    pass

class ContactForm(ContactFormBase):
    id: int
    created_at: datetime  # 修正：timestamp → created_at

    class Config:
        orm_mode = True

'''
キャリアアンケート用
'''
class QuestionBase(BaseModel):
    question_text: str
    choice_a: Optional[str] = None
    choice_b: Optional[str] = None
    choice_c: Optional[str] = None
    choice_d: Optional[str] = None
    next_question_a_id: Optional[int] = None
    next_question_b_id: Optional[int] = None
    next_question_c_id: Optional[int] = None
    next_question_d_id: Optional[int] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int

    class Config:
        orm_mode = True


class ResponseBase(BaseModel):
    question_id: int
    answer: str
    free_text: Optional[str] = None
    slack_user_id: str

class ResponseCreate(ResponseBase):
    pass

class Response(ResponseBase):
    id: int
    employee_id: int
    created_at: datetime

    class Config:
        orm_mode = True