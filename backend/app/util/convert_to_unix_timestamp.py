import logging
import os
from dotenv import load_dotenv
from datetime import datetime
import time

load_dotenv()

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def convert_to_unix_timestamp(date_str: str) -> int:
    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        return int(time.mktime(dt.timetuple()))
    except ValueError:
        raise ValueError("◆ 日付のデータ形式が無効です。YYYY-MM-DDを使用してください。")