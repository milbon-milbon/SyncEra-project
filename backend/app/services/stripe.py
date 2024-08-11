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
    
    logging.info(f"==== 受信したウェブフック==== : {payload}")
    logging.info(f"==== 署名==== : {sig_header}")

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

    if not all([email, company_name, first_name, last_name]):
        raise ValueError("必要なメタデータが不足しています")

    try:
        # Authenticationに企業情報を保存
        user = auth.create_user(
            email=email,
            password=generate_temporary_password(),
            display_name=company_name,
            custom_claims={'isCompanyAdmin': True}
        )
        
        logging.info(f"企業管理者ユーザーが正常に作成されました: {user.uid}")

        # Firebase Cloud Functionをトリガー
        functions_framework.create_function(
            'generate_company_id_and_send_email',
            'firebase.pubsub_v1',
            {
                'userId': user.uid,
                'email': email,
                'companyName': company_name,
                'firstName': first_name,
                'lastName': last_name,
            }
        )
    except auth.AuthError as e:
        logging.error(f"企業管理者ユーザー作成中にエラーが発生しました: {str(e)}")
        raise  # このエラーを上位の関数に伝播させる

def generate_temporary_password():
    import random
    import string
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))

# 変更後（登録されない。）
# import stripe
# import os
# import firebase_admin
# import logging
# from fastapi import APIRouter, HTTPException, Request
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from firebase_admin import credentials, firestore, auth

# load_dotenv()
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # Stripe APIキーの設定
# stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# # FastAPIのルーターを作成
# router = APIRouter()

# # Firebaseの初期化
# cred = credentials.Certificate("secrets/firebase-adminsdk.json")
# if not firebase_admin._apps:
#     firebase_admin.initialize_app(cred)
# db = firestore.client()

# # リクエストボディのスキーマ
# class CheckoutSessionRequest(BaseModel):
#     priceId: str
#     companyName: str
#     email: str
#     firstName: str
#     lastName: str

# # チェックアウトセッションの作成エンドポイント
# @router.post("/create-checkout-session")
# async def create_checkout_session(request: CheckoutSessionRequest):
#     data = request.dict()  # リクエストデータを辞書として取得
#     try:
#         checkout_session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[
#                 {
#                     'price': data['priceId'],
#                     'quantity': 1,
#                 },
#             ],
#             mode='subscription',
#             success_url=f"{os.getenv('FRONTEND_URL')}/success?session_id={{CHECKOUT_SESSION_ID}}",
#             cancel_url=f"{os.getenv('FRONTEND_URL')}/canceled",
#             metadata={
#                 'email': data['email'],
#                 'companyName': data['companyName'],
#                 'firstName': data['firstName'],
#                 'lastName': data['lastName'],
#             },
#         )
#         return {"url": checkout_session.url, "sessionId": checkout_session.id}
#     except Exception as e:
#         logging.error(f"チェックアウトセッションの作成中にエラーが発生しました: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# # Stripe Webhookの処理エンドポイント
# @router.post("/webhook")
# async def stripe_webhook(request: Request):
#     payload = await request.body()
#     sig_header = request.headers.get('stripe-signature')
    
#     logging.info(f"==== 受信したウェブフック==== : {payload}")
#     logging.info(f"==== 署名==== : {sig_header}")

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
#         )
#     except ValueError:
#         logging.error("==== 署名シークレットエラー: ペイロードが無効です ====")
#         raise HTTPException(status_code=400, detail="Invalid payload")
#     except stripe.error.SignatureVerificationError:
#         logging.error("==== 署名が無効です ====")
#         raise HTTPException(status_code=400, detail="Invalid signature")

#     if event['type'] in ['checkout.session.completed', 'payment_intent.succeeded']:
#         session = event['data']['object']
#         try:
#             await handle_checkout_session(session)
#             return {"status": "success"}
#         except Exception as e:
#             logging.error(f"Webhook処理中にエラーが発生しました: {str(e)}")
#             raise HTTPException(status_code=500, detail=str(e))

#     return {"status": "success"}

# # チェックアウトセッションの処理
# async def handle_checkout_session(session):
#     session_id = session.get('id')

#      # ここで企業情報をセッションIDから取得
#     company_info = await get_company_info_by_session_id(session_id)
#     if not company_info:
#         raise ValueError("企業情報が見つかりません")

#     try:
#         # Firebase Authenticationに企業情報を保存
#         user = auth.create_user(
#             email=company_info['email'],  # SIGNUP時のメールアドレスを使用
#             # password=generate_temporary_password(),  # 自動生成パスワード
#             display_name=company_info['companyName'],  # SIGNUP時の会社名を使用
#             custom_claims={'isCompanyAdmin': True}  # カスタムクレームで企業管理者を表す
# )
        
#         logging.info(f"企業管理者ユーザーが正常に作成されました: {user.uid}")

#         # Firebase Cloud Functionをトリガーするなど、追加の処理があればここで実行
#     except Exception as e:
#         logging.error(f"企業管理者ユーザー作成中にエラーが発生しました: {str(e)}")
#         raise  # このエラーを上位の関数に伝播させる
