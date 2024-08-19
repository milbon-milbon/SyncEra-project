// frontend/src/components/payment/CompanyLoginButton.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function CompanyLoginButton() {
  return (
    <Link href='/login/company'>
      <button className='bg-[#003366] text-white px-4 py-2 rounded border border-white font-bold hover:bg-[#66B2FF] active:transform active:translate-y-1 transition-colors duration-300'>
        管理画面
      </button>
    </Link>
  );
}
