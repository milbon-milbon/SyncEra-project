from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.models import AnalysisResult
from app.db.database import get_db
import logging
import os

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def make_analysis_results_list(slack_user_id: str, db: Session = Depends(get_db)):
    try:
        # 指定されたslack_user_idに対応する分析結果をデータベースから取得
        results = db.query(AnalysisResult).filter(AnalysisResult.slack_user_id == slack_user_id).all()

        # 結果が見つからなかった場合の処理
        if not results:
            raise HTTPException(status_code=404, detail="分析結果が見つかりません")

        # JSON形式で結果を整える
        return [{"slack_user_id": result.slack_user_id, "result": result.result, "created_at": result.created_at} for result in results]
    except Exception as e:
        # エラーが発生した場合のロギングと例外処理
        logger.error(f"データ取得中のエラー: {e}")
        raise HTTPException(status_code=500, detail=f"データ取得中のエラー: {e}")

#_____挙動テスト用_____
# sayokoさん: 以下のコメントアウトを解除して、コンテナでこのファイルの実行をお願いします
# (アンケート回答終了と同時に uti/survey_analysis/save_analysis_result.py が実行できるようになったら）
# slack_user_id = "U07F8NPV1RQ" #meme
# db=get_db()

# test_response=make_analysis_results_list(slack_user_id, db)
# print(test_response)
