from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import get_db
from app.db.models import SummarizeHistory
from app.services.redis_client import redis_client
import logging
import os
import json


log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CACHE_KEY_PREFIX = 'summary_reports:' 

def get_all_saved_summary_reports(slack_user_id: str, db: Session = Depends(get_db)):
    # キャッシュキーの生成
    cache_key = f"{CACHE_KEY_PREFIX}{slack_user_id}"
    
    # Redisからキャッシュデータを取得
    cached_data = redis_client.get(cache_key)
    if cached_data:
        logger.info("◆キャッシュからサマリーレポートデータを取得しました。")
        return json.loads(cached_data.decode('utf-8'))
    
    # データベースから該当ユーザーの全てのサマリーデータを取得
    summary_reports = (
        db.query(SummarizeHistory) 
        .filter(SummarizeHistory.slack_user_id == slack_user_id)
        .order_by(desc(SummarizeHistory.created_at))
        .all()
    )

    # データが見つからない場合
    if not summary_reports:
        raise HTTPException(status_code=404, detail="このユーザーのサマリーデータが見つかりません")
    
    # データを辞書形式に変換してキャッシュに保存
    summary_reports_data = [report.to_dict() for report in summary_reports]
    redis_client.set(cache_key, json.dumps(summary_reports_data), ex=43200)  # 12時間 = 43200秒
    
    logger.debug(f'◆サマリーレポート: {summary_reports}')
    return summary_reports
