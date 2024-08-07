// frontend/src/app/login/page.tsx
'use client';
import React from 'react';
import Email from '@/components/payment/Email';
import NextButton from '@/components/payment/NextButton';
import LogoWblue from '@/components/payment/LogoWblue';

export default function SignUp() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
      <LogoWblue />
      {/* 登録フォームを配置 */}
      <form className='bg-gray-100 p-6 rounded-lg shadow-lg max-w-md'>
        <h1 className='text-center text-2xl font-bold mb-3 text-[#003366]'>ご登録フォーム</h1>
        {/* フォーム要素例 */}
        <div className='mb-4'>
          <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='email'>
            社名・団体名
          </label>
          <input
            type='name'
            id='name'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='office_name'
          />
        </div>
        <div className='mb-4 flex space-x-4'>
          <div className='w-1/2'>
            <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='lastName'>
              氏
            </label>
            <input
              type='text'
              id='lastName'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
              placeholder='name'
            />
          </div>
          <div className='w-1/2'>
            <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='firstName'>
              名
            </label>
            <input
              type='text'
              id='firstName'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
              placeholder=''
            />
          </div>
        </div>
        <Email />
        <NextButton />
      </form>
    </div>
  );
}
