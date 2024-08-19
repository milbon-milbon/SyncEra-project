// frontend/src/components/payment/LogoWblue.tsx
'use client';
import React from 'react';
import Link from 'next/link';
export default function LogoWblue() {
  return (
    <Link href='/'>
      <img
        src='/logo/white_1.png'
        alt='Logo'
        className='absolute left-[510px] top-[100px]  w-25 h-9'
      />
    </Link>
  );
}
