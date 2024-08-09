# backend/app/services/stripe.py

import uuid
import firebase_admin
import stripe
import os
import smtplib
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from email.mime.text import MIMEText
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

router = APIRouter()

cred = credentials.Certificate("secrets/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

class CheckoutSessionRequest(BaseModel):
    priceId: str
    userId: str
    email: str
    companyName: str
    firstName: str
    lastName: str

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
            metadata={
                'userId': request.userId,  
            } 
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('Stripe-Signature')
    event = None
    
    logging.info(f"==== 受信したウェブフック==== : {payload}")
    logging.info(f"==== 署名==== : {sig_header}")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError as e:
        logging.error("==== 署名シークレットエラー: ペイロードが無効です ====")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logging.error("==== 署名が無効です ====")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        userId = session['metadata']['userId']
        email = session['metadata']['email']
        companyName = session['metadata']['companyName']
        firstName = session['metadata']['firstName']
        lastName = session['metadata']['lastName']
        company_id = generate_company_id()  # 任意の会社IDを生成する関数
        logging.info(f"==== 生成された会社ID==== : {company_id} for userId: {userId}")
        
        # Firestoreに会社情報を保存
        db.collection('companies').document(userId).set({
            'company_id': company_id,
            'email': email,
            'companyName': companyName,
            'firstName': firstName,
            'lastName': lastName
        })
        # メールで会社IDを送信
        send_email(email, company_id)

    return {"status": "success"}

def generate_company_id():
    return "COMPANY-" + str(uuid.uuid4())

def send_email(recipient_email, company_id):
    try:
        sender_email = "your-email@example.com"
        password = "your-email-password"

        subject = "Your Company ID"
        body = f"Thank you for your registration. Your company ID is {company_id}."

        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = recipient_email

        with smtplib.SMTP_SSL('smtp.example.com', 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        logging.info(f"==== メールが送信されました====  {recipient_email} with company ID {company_id}")
    except smtplib.SMTPException as e:
        logging.error(f"==== メールを送信できませんでした====  {recipient_email}: {str(e)}")
    except Exception as e:
        logging.error(f"==== 予期しないエラーが発生しました==== : {str(e)}")
