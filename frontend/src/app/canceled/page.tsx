// frontend/src/app/canceled/page.tsx
import React from 'react';
import Link from 'next/link';
import LogoWblue from '@/components/payment/LogoWblue';

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
  const handleBackClick = () => {
    console.log('Back to Home button clicked'); // ボタンがクリックされたことをログ出力
  };
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
      {/* ロゴを表示 */}
      <LogoWblue />

      {/* キャンセルメッセージとボタン */}
      <div className='mt-28 text-center'>
        {' '}
        {/* ロゴからの距離を調整するためにmt-を追加 */}
        <h1 className='text-3xl font-bold mb-4 text-[#003366]'>Canceled</h1>
        <img
          src='payment/canceled.png '
          alt='Payment Canceled'
          className='max-w-md h-auto mb-6 mx-auto'
        />
        <p className='text-lg mb-6 text-[#003366]'>
          新規登録、お支払いがキャンセルされました。もう一度やり直す場合は、ホームに戻ってください。
        </p>
        {/* トップページに戻るボタン */}
        <Link href='/'>
          <button
            className='mt-0 px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002244] focus:outline-none mb-20'
            onClick={handleBackClick}
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
