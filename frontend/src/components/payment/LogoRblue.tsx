// frontend/src/components/payment/LogoRblue.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function LogoRblue() {
  return (
    <Link href='/'>
      <img
        src='/logo/darkblue_1.png'
        alt='Logo'
        className='absolute left-[510px] top-[100px]  w-25 h-9'
      />
    </Link>
  );
}
