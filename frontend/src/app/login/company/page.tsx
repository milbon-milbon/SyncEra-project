// frontend/src/app/login/company/page.tsx==企業管理者画面ログイン==

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import LogoWhite from '@/components/payment/LogoWhite';
import Link from 'next/link';
import '@/firebase/config';
import clientLogger from '@/lib/clientLogger';

export default function CompanyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 管理者かどうかを確認（カスタムクレームを利用）
      const token = await user.getIdTokenResult();
      if (token.claims.isCompanyAdmin) {
        clientLogger.info('=== 管理者アカウントログイン成功=== ');
        router.push('/admin-dashboard');
      } else {
        alert('管理者権限がありません。アカウントを作成してください。');
        throw new Error('管理者権限がありません。');
      }
    } catch (error) {
      clientLogger.error(`===管理者アカウントログイン失敗:=== , ${error}`);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='メールアドレスを入力してください'
            className='shadow appearance-none border rounded w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline shadow-custom' // shadow-customを追加
            required
          />
          <input
            type='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='パスワードを入力してください'
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
