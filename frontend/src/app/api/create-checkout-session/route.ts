// frontend/src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// 環境変数の出力
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);
console.log('Public Domain:', process.env.NEXT_PUBLIC_DOMAIN);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// POSTメソッドをエクスポート
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_DOMAIN) {
    console.error(
      '環境変数が正しく設定されていません。STRIPE_SECRET_KEY または NEXT_PUBLIC_DOMAIN が見つかりません。',
    );
  }
  try {
    const { price_id } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    if (error instanceof Stripe.errors.StripeCardError) {
      console.error('カードエラーが発生しました:', error.message);
    } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      console.error('リクエストエラーが発生しました:', error.message);
    } else {
      console.error('その他のエラーが発生しました:', error.message);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
