import logging
import os
from dotenv import load_dotenv
from datetime import datetime, date
import time

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def convert_to_unix_timestamp(date_value) -> float:
    try:
        if isinstance(date_value, str):  # 引数が文字列の場合
            dt = datetime.strptime(date_value, '%Y-%m-%d')
        elif isinstance(date_value, datetime):  # 引数が datetime オブジェクトの場合
            dt = date_value
        elif isinstance(date_value, date):  # 引数が date オブジェクトの場合
            dt = datetime(year=date_value.year, month=date_value.month, day=date_value.day)
        else:
            raise ValueError("◆ 引数は文字列、datetime、またはdateオブジェクトである必要があります。")
        
        # UNIXタイムスタンプに変換
        return time.mktime(dt.timetuple())

    except ValueError as e:
        raise ValueError(f"◆日付のデータ形式が無効です。エラー: {e}")

# def convert_to_unix_timestamp(date_str: str) -> int:
#     try:
#         dt = datetime.strptime(date_str, '%Y-%m-%d')
#         return int(time.mktime(dt.timetuple()))
#     except ValueError:
#         raise ValueError("◆ 日付のデータ形式が無効です。YYYY-MM-DDを使用してください。")