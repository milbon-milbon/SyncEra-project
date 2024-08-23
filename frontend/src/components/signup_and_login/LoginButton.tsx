// frontend/src/components/payment/NextButton.tsx
/// components/LoginButton.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link href='/login/employee'>
      <button className='bg-[#66B2FF] text-white px-4 py-2 rounded  font-bold hover:bg-blue-500 active:transform active:translate-y-1 transition-colors duration-300'>
        ログイン
      </button>
    </Link>
  );
}
