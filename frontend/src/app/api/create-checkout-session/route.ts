// frontend/src/app/api/create-checkout-session/route.ts変更後
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripeのインスタンスを作成
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// POSTメソッドをエクスポート
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_DOMAIN) {
    return NextResponse.json({ error: '環境変数の設定エラー' }, { status: 500 });
  }

  try {
    const { priceId } = await request.json();

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: '無効な priceId' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/canceled`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'StripeError' || error.message.includes('Stripe')) {
        return NextResponse.json({ error: 'Stripe API Error' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
