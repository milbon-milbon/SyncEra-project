from sqlalchemy import Column, String, Integer, Text, ForeignKey, TIMESTAMP, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from .database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

'''
models（テーブルとカラム)の定義ができたらbackendコンテナの中に入り、以下の操作を実行
1. migration 自動生成
    alembic revision --autogenerate -m "コメント挿入"
2. migrationをDBに適用する
    alembic upgrade head
'''

Base = declarative_base()

class Employee(Base):
    __tablename__ = 'employee'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    project = Column(String(100), nullable=False)
    slack_user_id = Column(String, ForeignKey('slack_user_info.id'), nullable=False, unique=True)
    # SlackUserInfoテーブルとのリレーションシップを追加
    slack_user_info = relationship("SlackUserInfo", back_populates="employee")
    # Responseテーブルとのリレーションシップを追加
    responses = relationship("UserResponse", back_populates="employee")

class SlackUserInfo(Base):
    __tablename__ = 'slack_user_info'

    id = Column(String(100), primary_key=True)
    name = Column(String(100), nullable=False)
    real_name = Column(String(100), nullable=False)
    image_512 = Column(String, nullable=True)
    # Employeeテーブルとのリレーションシップを追加
    employee = relationship("Employee", back_populates="slack_user_info")

class DailyReport(Base):
    __tablename__ = 'daily_report'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    text = Column(Text, nullable=False)
    ts = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    # edited = Column(String, nullable=True)
    # edited_by = Column(String(100), nullable=True)
    # edited_ts = Column(String, nullable=True)

    def __repr__(self):
        return f"<DailyReport(id={self.id}, user_id={self.user_id}, text={self.text}, ts={self.ts}, created_at={self.created_at})>"

class TimesTweet(Base):
    __tablename__ = 'times_tweet'

    id = Column(Integer, primary_key=True, autoincrement=True)
    channel_id = Column(String, ForeignKey('times_list.channel_id'), nullable=False)
    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    text = Column(Text, nullable=False)
    ts = Column(Float, nullable=False)
    thread_ts = Column(Float, nullable=True)
    parent_user_id = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    # edited = Column(String, nullable=True)
    # edited_by = Column(String(100), nullable=True)
    # edited_ts = Column(String, nullable=True)

    def __repr__(self):
        return f"<TimesTweet(id={self.id}, user_id={self.user_id}, text={self.text}, created_at={self.created_at})>"

class TimesList(Base):
    __tablename__ = 'times_list'

    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    channel_name = Column(String(100), nullable=False)
    channel_id = Column(String(100), primary_key=True, nullable=False)

class ContactForm(Base):
    __tablename__ = 'contact_form'

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_name = Column(String(100), nullable=False) # 追加
    department = Column(String(100), nullable=True) # 追加
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

class SummarizeHistory(Base):
    __tablename__ = 'summarize_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey('employee.id'), nullable=False)
    summary = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

class AdvicesHistory(Base):
    __tablename__ = 'advices_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey('employee.id'), nullable=False)
    advices = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

# ここからcareer_survey用の定義

class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    choice_a = Column(String, nullable=True)
    choice_b = Column(String, nullable=True)
    choice_c = Column(String, nullable=True)
    choice_d = Column(String, nullable=True)
    next_question_a_id = Column(Integer, ForeignKey('questions.id'), nullable=True)
    next_question_b_id = Column(Integer, ForeignKey('questions.id'), nullable=True)
    next_question_c_id = Column(Integer, ForeignKey('questions.id'), nullable=True)
    next_question_d_id = Column(Integer, ForeignKey('questions.id'), nullable=True)

    next_question_a = relationship("Question", remote_side=[id], foreign_keys=[next_question_a_id])
    next_question_b = relationship("Question", remote_side=[id], foreign_keys=[next_question_b_id])
    next_question_c = relationship("Question", remote_side=[id], foreign_keys=[next_question_c_id])
    next_question_d = relationship("Question", remote_side=[id], foreign_keys=[next_question_d_id])
    responses = relationship("UserResponse", order_by="UserResponse.id", back_populates="question")

class UserResponse(Base):
    __tablename__ = 'responses'

    id = Column(Integer, primary_key=True, index=True)
    slack_user_id = Column(String, ForeignKey('employee.slack_user_id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'))
    answer = Column(String)
    free_text = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    employee = relationship("Employee", back_populates="responses")
    question = relationship("Question", back_populates="responses")