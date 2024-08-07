// frontend/src/components/payment/Pssword.tsx
'use client';
import React from 'react';

export default function Password() {
  return (
    <div className='mb-4'>
      <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='password'>
        パスワード
      </label>
      <input
        type='password'
        id='password'
        className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
        placeholder='******************'
      />
    </div>
  );
}
