// frontend/src/app/login/page.tsx
'use client';
import React from 'react';
import LoginButton from '@/components/signup_and_login/LoginButton';
import LogoWblue from '@/components/payment/LogoWblue';
import clientLogger from '@/lib/clientLogger';
import EmailId from '@/components/signup_and_login/EmailId';
import Password from '@/components/signup_and_login/Password';

export default function Login() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // フォームのデフォルト動作を防ぐ
    clientLogger.info('フォームが送信されました');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
      <LogoWblue />
      {/* ログインを配置 */}
      <form
        className='bg-white p-[15px] md:p-[35px] rounded-lg shadow-2xl w-full max-w-md border-[4px] border-[#66b2ff]'
        onSubmit={handleSubmit}
      >
        <h1 className='text-[20px] font-bold mb-8 text-[#003366]'>ログイン</h1>
        {/* フォーム要素例 */}
        <div className='mb-6'>
          <label className='block text-[#003366] text-sm mb-2' htmlFor='officeName'>
            企業ID
          </label>
          <input
            type='text'
            id='officeName'
            name='officeName'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] text-sm leading-tight focus:outline-none focus:shadow-outline'
            placeholder='ご登録企業のアカウント'
          />
        </div>
        <EmailId />
        <div className='mb-[50px]'>
          <Password />
        </div>
        <LoginButton />
      </form>
    </div>
  );
}
