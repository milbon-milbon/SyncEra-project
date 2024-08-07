// frontend/src/components/payment/NextButton.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import clientLogger from '@/lib/clientLogger';

export default function NextButton() {
  const handleClick = () => {
    clientLogger.info('ボタンクリック');
  };

  return (
    <Link href='/pricing'>
      <div className='flex justify-center'>
        <button
          onClick={handleClick}
          type='button'
          className='mt-6 w-full px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] focus:outline-none '
        >
          次へ
        </button>
      </div>
    </Link>
  );
}
