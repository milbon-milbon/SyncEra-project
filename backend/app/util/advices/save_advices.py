from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AdvicesHistory
from app.db.schemas import AdvicesRequest
import uuid

def save_advices(advices: AdvicesRequest, db: Session = Depends(get_db)):
    # 新しいAdvicesHistoryレコードを作成
    new_advice = AdvicesHistory(
        slack_user_id=advices.slack_user_id,
        advices=advices.advices
    )

    # 新しいレコードをデータベースに追加してコミット
    db.add(new_advice)
    db.commit()
    db.refresh(new_advice)

    return {"message": "1on1アドバイスが正常に保存されました", "id": new_advice.id}

# #挙動確認用のテストコード
# db=get_db()
# advices=AdvicesRequest(
#     slack_user_id='sample_4',  # employee_idはUUIDの文字列形式
#     advices='''ここに保存したい文章絵お入れる（本来はLLMが出力したアドバイス内容）'''
# )
# response=save_advices(advices, db)
# print(response)