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
    console.error(
      '環境変数が正しく設定されていません。STRIPE_SECRET_KEY または NEXT_PUBLIC_DOMAIN が見つかりません。',
    );
    return NextResponse.json({ error: '環境変数の設定エラー' }, { status: 500 });
  }

  try {
    const { priceId } = await request.json();

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
      // metadata: {
      //   priceId,
      // },
    });
    // console.log('メタデータ:', priceId);
    console.log('チェックアウトセッションが正常に作成されました:');

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.log('チェックアウトセッションの作成中にエラーが発生しました:', error.message);

    if (error instanceof Stripe.errors.StripeCardError) {
      console.log('カードエラーが発生しました:', error.message);
    } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      console.log('リクエストエラーが発生しました:', error.message);
    } else {
      console.log('その他のエラーが発生しました:', error.message);
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
