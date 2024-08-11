// frontend/src/app/login/employee/page.tsx==社員ログイン==
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import LogoWblue from '@/components/payment/LogoWblue';

export default function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/employee-dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
      <LogoWblue />
      {/* ログインを配置 */}
      <form
        className='bg-white p-[15px] md:p-[35px] rounded-lg shadow-2xl w-full max-w-md border-[4px] border-[#66b2ff]'
        onSubmit={handleSubmit}
      >
        <h1 className='text-2xl font-bold mb-8 text-[#003366]'>ログイン</h1>
        {/* フォーム要素例 */}
        <div className='mb-4'>
          <label className='block text-[#003366] text-[17px]  mb-2' htmlFor='email'>
            ID(メールアドレス)
          </label>

          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='メールアドレスを入力してください'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        <div className='mb-[50px]'>
          <label className='block text-[#003366] text-[17px]  mb-2' htmlFor='password'>
            パスワード
          </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='パスワードを入力してください'
            required
            className=' shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        {/*TODO:リンク先を管理画面へ変更予定*/}
        <div className='flex justify-center'>
          <button
            type='submit'
            className=' bg-[#003366] text-white py-2 px-[170px] rounded-lg hover:bg-[#002244] focus:outline-none'
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
}
