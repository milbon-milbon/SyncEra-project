from pydantic import BaseModel
from typing import Optional
from datetime import datetime

'''
従業員情報をAPIレスポンスに乗せる用
'''
class EmployeeBase(BaseModel):
    name: str
    email: str
    department: str
    role: str
    project: str
    slack_user_id: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: str

    class Config:
        orm_mode = True

'''
問い合わせフォームの内容をAPIレスポンスに乗せる用
'''
class ContactFormBase(BaseModel):
    name: str
    email: str
    message: str

class ContactFormCreate(ContactFormBase):
    pass

class ContactForm(ContactFormBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True