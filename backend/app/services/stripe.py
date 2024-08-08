# backend/app/services/stripe.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore


load_dotenv()

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

router = APIRouter()

cred = credentials.Certificate("path/to/your-firebase-adminsdk.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

class CheckoutSessionRequest(BaseModel):
    priceId: str
    email: str

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': request.priceId,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/canceled',
            metadata={'email': request.email}
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#以下webhook追加
@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('Stripe-Signature')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        email = session['metadata']['email']
        company_id = generate_company_id()  # 任意の会社IDを生成する関数
        # Firestoreに会社情報を保存
        db.collection('companies').document(email).set({'company_id': company_id})
        # メールで会社IDを送信
        send_email(email, company_id)

    return {"status": "success"}

def generate_company_id():
    # 任意の会社IDを生成するロジック
    return "COMPANY-" + str(uuid.uuid4())

def send_email(email, company_id):
    # メール送信ロジック
    pass