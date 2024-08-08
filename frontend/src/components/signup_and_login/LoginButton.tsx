// frontend/src/components/payment/NextButton.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import clientLogger from '@/lib/clientLogger';

export default function LoginButton() {
  const handleClick = () => {
    clientLogger.info('ボタンクリック');
  };

  return (
    <Link href='/'>
      {' TODO:管理画面URLへ変更予定'}
      <div className='flex justify-center'>
        <button
          onClick={handleClick}
          type='button'
          className='mt-6 w-full px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] focus:outline-none '
        >
          ログイン
        </button>
      </div>
    </Link>
  );
}
