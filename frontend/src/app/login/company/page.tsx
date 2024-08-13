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
        throw new Error('管理者権限がありません。');
      }
    } catch (error) {
      alert('管理者権限がありません。アカウントを作成してください。');
      clientLogger.error(`===管理者アカウントログイン失敗:=== , ${error}`);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-[#003366] p-[25px] box-border'>
      <div className='flex flex-col flex-grow bg-white'>
        <LogoWhite />
        {/* ログインを配置 */}
        <form
          className='absolute left-[50%] top-[250px] translate-x-[-50%] w-full max-w-[300px]'
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col items-center mb-2'>
            <div className='w-full p-[0px] '>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='メールアドレスを入力してください'
                className='shadow appearance-none border rounded  mb-8 shadow-md   w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline shadow-custom focus:ring focus:ring-[#66b2ff] focus:border-[#66b2ff]'
                required
              />
            </div>
            <div className='w-full p-[0px] mb-16'>
              <input
                type='text'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='パスワードを入力してください'
                className='shadow appearance-none border rounded  shadow-md   w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline shadow-custom focus:ring focus:ring-[#66b2ff] focus:border-[#66b2ff]'
                required
              />
            </div>
            <div className='w-full items-center  p-[0px] mb-0 '>
              <button
                type='submit'
                className='w-full bg-[#66b2ff] text-white  text-[17px] py-2 px-3 rounded-full hover:bg-[#99ccff] focus:outline-none'
              >
                ログイン
              </button>
            </div>
          </div>
          <div className='w-full p-[5px]'>
            <p className='text-[15px] text-[#003366]  '>
              <Link href='/signup'>
                {/*TODO:メール入力に変更 */}
                <span className=' text-blue-500 underline ml-1'>パスワードお忘れの方</span>
              </Link>
            </p>
            <p className='text-[15px] text-[#003366] '>
              <Link href='/signup'>
                アカウント登録がお済みでない場合は
                <span className='text-blue-500 underline ml-1'>こちら</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
