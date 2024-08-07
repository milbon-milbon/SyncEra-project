// frontend/src/components/payment/Email.tsx
'use client';
import React from 'react';

export default function Emai() {
  return (
    <div className='mb-4'>
      <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='email'>
        メールアドレス
      </label>
      <input
        type='email'
        id='email'
        className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
        placeholder='example@example.com'
      />
    </div>
  );
}
