// frontend/src/components/payment/Pssword.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function Password() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => {
    console.log('ボタンクリック');
    // e.preventDefault(); // デバッグ時にページ遷移を防ぎたい場合に使用
  };
  return (
    <div className='mb-4'>
      <label className='block text-[#003366] text-sm mb-2' htmlFor='password'>
        パスワード
      </label>
      <input
        type='password'
        id='password'
        className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] text-sm leading-tight focus:outline-none focus:shadow-outline'
        placeholder='パスワード'
      />
      <p className='text-[#003366] text-sm ml-1'>
        パスワードを忘れた方は
        <Link href='/'>
          <span className='text-blue-500 underline ml-1' onClick={handleClick}>
            こちら {' TODO:メール問い合わせURLへ変更予定'}
          </span>
        </Link>
      </p>
    </div>
  );
}
