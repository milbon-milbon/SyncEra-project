import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session
from app.services.slack_event import get_and_save_users, get_and_save_daily_report, get_and_save_times_tweet
from app.db.models import SlackUserInfo, DailyReport, TimesTweet

#  unittest.mock の MagicMock と patch を使用して、依存する外部リソースやメソッドをモックしてデータベースのセッション管理
@pytest.fixture
def db_session():
    return MagicMock(spec=Session)

# Mock Slack client
@pytest.fixture
def slack_client_mock(monkeypatch):
    mock = MagicMock()
    monkeypatch.setattr("app.services.slackApi.slack_client", mock)
    return mock

# ユーザー情報の取得とDB保存テスト
def test_get_and_save_users(db_session: Session, slack_client_mock: MagicMock):
    # ベタ打ちのモックデータ
    users_list_data = {
        "members": [
            {"id": "U01", "name": "user1", "real_name": "User One"},
            {"id": "U02", "name": "user2", "real_name": "User Two"}
        ]
    }
    slack_client_mock.users_list.return_value = users_list_data

    result = get_and_save_users(db_session)
    assert result["status"] == "success"

    # db_session.mergeが正しいデータで呼び出されたか確認
    expected_calls = [
        patch.call(SlackUserInfo(id="U01", name="user1", real_name="User One")),
        patch.call(SlackUserInfo(id="U02", name="user2", real_name="User Two"))
    ]
    db_session.merge.assert_has_calls(expected_calls, any_order=True)
    db_session.commit.assert_called_once()

# 日報の取得とDB保存テスト
def test_get_and_save_daily_report(db_session: Session, slack_client_mock: MagicMock):
    # ベタ打ちのモックデータ
    users_list_data = {
        "members": [
            {"id": "U01", "name": "user1", "real_name": "User One"}
        ]
    }
    conversations_history_data = {
        "messages": [
            {"ts": "12345.67890", "user": "U01", "text": "Daily report message"}
        ]
    }
    slack_client_mock.users_list.return_value = users_list_data
    slack_client_mock.conversations_history.return_value = conversations_history_data

    event = {}
    result = get_and_save_daily_report(event, db_session)
    assert result["status"] == "success"

    # db_session.mergeが正しいデータで呼び出されたか確認
    expected_user_calls = [
        patch.call(SlackUserInfo(id="U01", name="user1", real_name="User One"))
    ]
    expected_message_calls = [
        patch.call(DailyReport(ts="12345.67890", user_id="U01", text="Daily report message"))
    ]
    db_session.merge.assert_has_calls(expected_user_calls + expected_message_calls, any_order=True)
    db_session.commit.assert_called_once()

# Timesの取得とDB保存のテスト
def test_get_and_save_times_tweet(db_session: Session, slack_client_mock: MagicMock):
    # ベタ打ちのモックデータ
    users_list_data = {
        "members": [
            {"id": "U01", "name": "user1", "real_name": "User One"}
        ]
    }
    conversations_history_data = {
        "messages": [
            {"ts": "12345.67890", "user": "U01", "text": "Times tweet message"}
        ]
    }
    conversations_replies_data = {
        "messages": [
            {"ts": "12345.67891", "user": "U02", "text": "Reply message", "parent_user_id": "U01"}
        ]
    }
    slack_client_mock.users_list.return_value = users_list_data
    slack_client_mock.conversations_history.return_value = conversations_history_data
    slack_client_mock.conversations_replies.return_value = conversations_replies_data

    event = {"channel": "times-channel"}
    result = get_and_save_times_tweet(event, db_session)
    assert result["status"] == "success"

    # db_session.mergeが正しいデータで呼び出されたか確認
    expected_user_calls = [
        patch.call(SlackUserInfo(id="U01", name="user1", real_name="User One"))
    ]
    expected_message_calls = [
        patch.call(TimesTweet(ts="12345.67890", user_id="U01", text="Times tweet message", channel_id="times-channel")),
        patch.call(TimesTweet(ts="12345.67891", user_id="U02", text="Reply message", channel_id="times-channel", thread_ts="12345.67890", parent_user_id="U01"))
    ]
    db_session.merge.assert_has_calls(expected_user_calls + expected_message_calls, any_order=True)
    db_session.commit.assert_called_once()
