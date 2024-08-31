from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models import AnalysisResult
from app.db.database import get_db
from app.services.redis_client import redis_client
import logging
import os
import json

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_analysis_results_list(slack_user_id: str, db: Session = Depends(get_db)):
    
    try:
        cache_key = f"analysis_results:{slack_user_id}"
        
        # Redisからキャッシュを取得
        cached_data = redis_client.get(cache_key)
        if cached_data:
            logger.info("キャッシュからデータを取得しました")
            return json.loads(cached_data)
        
        # 指定されたslack_user_idに対応する分析結果をデータベースから取得
        results = (
            db.query(AnalysisResult)
            .filter(AnalysisResult.slack_user_id == slack_user_id)
            .order_by(desc(AnalysisResult.created_at))
            .all()
        )

        # 結果が見つからなかった場合の処理
        if not results:
            raise HTTPException(status_code=404, detail="分析結果が見つかりません")
        
        # データを辞書形式に変換
        results_list = [result.to_dict() for result in results]
        
        # Redisにデータをキャッシュ
        redis_client.set(cache_key, json.dumps(results_list), ex=2419200)  # 4週間


        # JSON形式で結果を整える
        return [{"slack_user_id": result.slack_user_id, "result": result.result, "created_at": result.created_at} for result in results]
    except Exception as e:
        # エラーが発生した場合のロギングと例外処理
        logger.error(f"データ取得中のエラー: {e}")
        raise HTTPException(status_code=500, detail=f"データ取得中のエラー: {e}")

