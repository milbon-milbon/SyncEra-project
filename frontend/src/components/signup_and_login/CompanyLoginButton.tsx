// frontend/src/components/payment/CompanyLoginButton.tsx
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function CompanyLoginButton() {
  useEffect(() => {
    console.log('CompanyLoginButton mounted');
  }, []);
  return (
    <Link href='/login/company'>
      <button className='bg-[#003366] text-white px-4 py-2 rounded border border-white font-semibold hover:bg-blue-200 hover:text-gray-600 active:transform active:translate-y-1 transition-colors duration-300'>
        管理画面
      </button>
    </Link>
  );
}
