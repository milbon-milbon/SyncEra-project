// frontend/src/app/canceled/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import LogoWblue from '@/components/payment/LogoWblue';
import clientLogger from '@/lib/clientLogger';

export default function CanceledPage() {
  const handleBackClick = () => {
    clientLogger.info('ボタンクリック');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
      <LogoWblue />

      <div className='mt-28 text-center'>
        <h1 className='text-3xl font-bold mb-4 text-[#003366]'>Canceled</h1>
        <img
          src='/payment/canceled.png'
          alt='Payment Canceled'
          className='max-w-md h-auto mb-6 mx-auto'
        />
        <p className='text-lg mb-6 text-[#003366]'>
          新規登録、お支払いがキャンセルされました。もう一度やり直す場合は、ホームに戻ってください。
        </p>
        <Link href='/'>
          <button
            onClick={handleBackClick}
            className='mt-0 px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002244] focus:outline-none mb-20'
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
