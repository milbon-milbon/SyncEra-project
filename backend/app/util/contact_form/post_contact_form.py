from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.db.models import ContactForm as ContactFormModel
from app.db.schemas import ContactFormCreate

def save_contact_to_db(db: Session, form_data: ContactFormCreate) -> ContactFormModel:
    try:
        # データベースに保存するための問い合わせオブジェクトを作成
        new_contact = ContactFormModel(
            company_name=form_data.company_name,
            department=form_data.department,
            name=form_data.name,
            email=form_data.email,
            message=form_data.message
        )
        
        db.add(new_contact)
        db.commit()
        db.refresh(new_contact)  # データベースで新しいレコードをリフレッシュ
        return new_contact
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="問い合わせの保存中にエラーが発生しました")
