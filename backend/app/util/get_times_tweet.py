import logging
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.models import TimesTweet
from app.db.database import get_db
from .convert_to_unix_timestamp import convert_to_unix_timestamp

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_times_tweet(slack_user_id: str, start_date, end_date):
    # YYYY-MM-DD から　Unixタイムスタンプ形式に変換する
    start_ts = convert_to_unix_timestamp(start_date)
    end_ts = convert_to_unix_timestamp(end_date)

    # データベースから指定したユーザーの指定期間分のtimesの投稿データを取得する
    db = get_db()
    try:
        target_times_tweet = db.query(TimesTweet).filter(
            and_(
                TimesTweet.user_id == slack_user_id,
                TimesTweet.ts >= start_ts, # UNIXからの変換必要
                TimesTweet.ts <= end_ts # UNIXからの変換必要
            )
        ).all()
        logger.debug("◆DBから正常にtimesの投稿データを取得できました。")
        return target_times_tweet
    except Exception:
        logger.error(f"""◆
        timesの投稿を取得中にエラーが発生しました。: {Exception}
        """)
        return[]
    finally:
        db.close()

# 取得したデータを通常の文字列に変換する必要がある場合は以下の処理を加える。
def compile_times_tweet_data(slack_user_id: str, start_date, end_date):
    pre_times_tweet_data = get_times_tweet(slack_user_id, start_date, end_date)

    # 会話履歴を文字列に変換
    if not pre_times_tweet_data:
        logger.info("◆文字列に変換しようとしているtimesの投稿データが見つかりません。")
        compiled_times_tweet_data = "日報記録がありません。"
    else:
        compiled_times_tweet_data = "必要に応じてここに出力形式を整える処理を追加する"
        logger.debug("◆timesの投稿データを読解可能な文字列に変換しました。")
    
    return compiled_times_tweet_data