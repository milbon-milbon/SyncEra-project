from pydantic import BaseModel
from typing import Optional

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

# 他の必要な Pydantic モデルもここに定義
