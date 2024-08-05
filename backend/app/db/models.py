from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from .database import Base

# models（テーブルとカラム)の定義ができたらbackendコンテナの中に入り、以下の操作を実行
# 1. migration 自動生成
    # alembic revision --autogenerate -m "Initial migration"   
# 2. migrationをDBに適用する
    # alembic upgrade head

Base = declarative_base()

class Employee(Base):
    __tablename__ = 'employee'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    project = Column(String(100), nullable=False)
    slack_user_id = Column(String, ForeignKey('slack_user_info.id'), nullable=False)

class SlackUserInfo(Base):
    __tablename__ = 'slack_user_info'

    id = Column(String(100), primary_key=True)
    name = Column(String(100), nullable=False)
    real_name = Column(String(100), nullable=False)

class DailyReport(Base):
    __tablename__ = 'daily_report'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    text = Column(Text, nullable=False)
    ts = Column(String, nullable=False)
    edited = Column(String, nullable=True)
    edited_by = Column(String(100), nullable=True)
    edited_ts = Column(String, nullable=True)

class TimesTweet(Base):
    __tablename__ = 'times_tweet'

    id = Column(Integer, primary_key=True, autoincrement=True)
    channel_id = Column(String, ForeignKey('times_list.channel_id'), nullable=False)
    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    text = Column(Text, nullable=False)
    ts = Column(String, nullable=False)
    thread_ts = Column(String, nullable=True)
    parent_user_id = Column(String, nullable=True)
    edited = Column(String, nullable=True)
    edited_by = Column(String(100), nullable=True)
    edited_ts = Column(String, nullable=True)

class Channel(Base):
    __tablename__ = 'times_list'

    user_id = Column(String(100), ForeignKey('slack_user_info.id'), nullable=False)
    channel_name = Column(String(100), nullable=False)
    channel_id = Column(String(100), primary_key=True, nullable=False)