// frontend/src/components/payment/NextButton.tsx
/// components/LoginButton.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function LoginButton() {
  return (
    <div className=' p-3 bg-white max-w-4xl mx-auto'>
      <Link href='/login/employee'>
        <button className='mt-8 px-6 py-3 bg-[#66b2ff] text-white rounded-lg hover:bg-[#99ccff] focus:outline-none mb-2'>
          ログイン
        </button>
      </Link>
    </div>
  );
}
