// frontend/src/api/create-portal-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // 最新のAPIバージョン
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}