# backend/app/services/stripe.py変更前

import stripe
import os
import firebase_admin
import functions_framework
import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, auth

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

router = APIRouter()

cred = credentials.Certificate("secrets/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
class CheckoutSessionRequest(BaseModel):
    priceId: str
    companyName: str
    email: str
    firstName: str
    lastName: str
    password: str
    
@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    data = await request.json()
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': data.priceId,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=f"{os.getenv('FRONTEND_URL')}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv('FRONTEND_URL')}/canceled",
            metadata={
                'email': request.email,
                'companyName': request.companyName,
                'firstName': request.firstName,
                'lastName': request.lastName,
                'password': request.password,
            },
        )
        return {"url": checkout_session.url}
    except Exception as e:
         logging.error(f"チェックアウトセッションの作成中にエラーが発生しました: {str(e)}")
         raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    logging.debug(f"==== 受信したウェブフック==== : {payload}")
    logging.debug(f"==== 署名==== : {sig_header}")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError:
        logging.error("==== 署名シークレットエラー: ペイロードが無効です ====")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        logging.error("==== 署名が無効です ====")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] in ['checkout.session.completed', 'payment_intent.succeeded']:
        session = event['data']['object']
        try:
            await handle_checkout_session(session)
            return {"status": "success"}
        except Exception as e:
            logging.error(f"Webhook処理中にエラーが発生しました: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    return {"status": "success"}

async def handle_checkout_session(session):
    email = session.get('metadata', {}).get('email')
    company_name = session.get('metadata', {}).get('companyName')
    first_name = session.get('metadata', {}).get('firstName')
    last_name = session.get('metadata', {}).get('lastName')
    password = session.get('metadata', {}).get('password')

    if not all([email, company_name, first_name, last_name, password]):
        raise ValueError("必要なメタデータが不足しています")

    try:
        # Authenticationに企業情報を保存
        user = auth.create_user(
            email=email,
            password=password,  # 受け取ったパスワードをそのまま使用
            display_name=company_name,
            custom_claims={'isCompanyAdmin': True}
        )
        
        logging.debug(f"企業管理者ユーザーが正常に作成されました: {user.uid}")

         # Firestoreに企業情報を保存
        await db.collection('companies').document(user.uid).set({
            'companyName': company_name,
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'created_at': firestore.SERVER_TIMESTAMP,
        })

        logging.debug(f"企業情報がFirestoreに保存されました: {user.uid}")

    except auth.AuthError as e:
        logging.error(f"企業管理者ユーザー作成中にエラーが発生しました: {str(e)}")
        raise  # このエラーを上位の関数に伝播させる
