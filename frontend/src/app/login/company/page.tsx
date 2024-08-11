// frontend/src/app/login/company/page.tsx==企業ログイン==

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import LogoWhite from '@/components/payment/LogoWhite';
import Link from 'next/link';

export default function CompanyLogin() {
  const [companyId, setCompanyId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const functions = getFunctions();
    const loginWithCompanyId = httpsCallable(functions, 'loginWithCompanyId');
    try {
      const result = await loginWithCompanyId({ companyId });
      const { customToken } = result.data as { customToken: string };
      const auth = getAuth();
      await signInWithCustomToken(auth, customToken);
      router.push('/admin');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <LogoWhite />
      {/* ログインを配置 */}
      <form className='absolute left-[600px] top-[250px] max-w-md' onSubmit={handleSubmit}>
        <div className='flex items-center p-[17px] mb-2'>
          <input
            type='text'
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            placeholder='企業ID'
            className='shadow appearance-none border rounded w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline shadow-custom' // shadow-customを追加
            required
          />
          <button
            type='submit'
            className='ml-4 bg-[#66b2ff] text-white py-2 px-5 w-auto whitespace-nowrap rounded-lg hover:bg-[#99ccff] focus:outline-none'
          >
            ログイン
          </button>
        </div>
        <p className='text-center text-[17px] text-[#003366]'>
          アカウント登録がお済みでない場合は
          <Link href='/signup'>
            <span className='text-blue-500 underline ml-1'>こちら</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
