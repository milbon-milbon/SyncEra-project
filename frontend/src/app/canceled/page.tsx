// frontend/src/app/canceled/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Canceled',
  description: 'Your payment was canceled. Please try again.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function CanceledPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-[#003366]">Canceled</h1>
      
      <img src="payment/canceled.png" alt="Payment Canceled" className="w-100% h-100% mb-6" />
      <p className="text-lg mb-6 text-[#003366]">新規登録、お支払いがキャンセルされました。もう一度やり直す場合は、ホームに戻ってください。</p>
      {/* トップページに戻るボタン */}
      <Link href="/">
        <button className="mt-6 px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002244] focus:outline-none mb-20">
          Back to Home
        </button>
      </Link>
      <img src="payment/white_2.png" alt="Payment Canceled" className="w-21 h-7 mb-6" />
    </div>
  );
}

