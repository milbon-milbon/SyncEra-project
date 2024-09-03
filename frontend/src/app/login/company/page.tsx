// frontend/src/app/login/company/page.tsx==企業管理者画面ログイン==

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import '@/firebase/config';
import clientLogger from '@/lib/clientLogger';
import '@/app/login/globals.css';
import { FirebaseError } from 'firebase/app';
import Loading from '@/components/loading';
import LogoWhite from '@/components/employeelist/LogoWhite';
export default function CompanyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ユーザーが既にログインしている場合
        const token = await user.getIdTokenResult();
        if (token.claims.isCompanyAdmin) {
          clientLogger.info('=== 既にログインしている管理者アカウントを検出 ===');
          router.push('/admin-dashboard');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, [router]);

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
        throw new Error('NOT_ADMIN');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            alert('このメールアドレスは登録されていません。新規登録をお願いします。');
            break;
          case 'auth/auth/invalid-email':
            alert('空のメールアドレスでサインインしています。再度お試しください。');
            break;
          case 'auth/invalid-email':
            alert('無効なメールアドレスです。');
            break;
          case 'auth/user-disabled':
            alert('このアカウントは無効化されています。管理者にお問い合わせください。');
            break;
          default:
            if (error.message === 'NOT_ADMIN') {
              alert('このアカウントには管理者権限がありません。管理者にお問い合わせください。');
            } else {
              alert('ログインに失敗しました。もう一度お試しください。');
            }
        }
      } else {
        alert('予期せぬエラーが発生しました。もう一度お試しください。');
      }
      clientLogger.error(`===管理者アカウントログイン失敗:=== , ${error}`);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <main className='min-h-screen flex flex-col bg-white text-gray-900'>
      {/* Header */}
      <header className='bg-[#003366] text-white p-4 md:p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <img
            src='/image/SyncEra(blue_white).png'
            alt='SyncEra Logo'
            className='h-[65px] w-[207px] mt-2 ml-2'
          />
          <div className='flex items-center space-x-2'>
            <Link href='/'>
              <button className='bg-white text-[#003366] border border-[#003366] px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base hover:bg-gray-200 active:transform active:translate-y-1 transition-colors duration-300'>
                ホーム
              </button>
            </Link>
            <span className='text-white'> 〉</span>
            <span className='text-white text-sm md:text-[20px] font-bold'>
              管理画面（ログイン）
            </span>
          </div>
        </div>
      </header>

      <div className='flex-grow flex justify-center px-4 md:px-0'>
        <form
          className='bg-white p-4 md:p-8 w-full max-w-md mx-auto mt-20' // Adjusted mt-8 to mt-4
          onSubmit={handleSubmit}
          autoComplete='off'
        >
          <div className='mb-6'>
            <label className='block text-[#003366] text-base md:text-[17px] mb-2' htmlFor='email'>
              ID(メールアドレス)
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='メールアドレスを入力してください'
              className='shadow appearance-none border rounded w-full py-2 md:py-3 px-3 text-[#003366] text-base md:text-[17px] leading-tight focus:outline-none focus:shadow-outline focus:ring focus:ring-[#66b2ff] focus:border-[#66b2ff]'
              required
              autoComplete='new-email'
            />
          </div>
          <div className='mb-[50px]'>
            <label
              className='block text-[#003366] text-base md:text-[17px] mb-2'
              htmlFor='password'
            >
              パスワード
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='パスワードを入力してください'
              className='shadow appearance-none border rounded w-full py-2 md:py-3 px-3 text-[#003366] text-base md:text-[17px] leading-tight focus:outline-none focus:shadow-outline focus:ring focus:ring-[#66b2ff] focus:border-[#66b2ff]'
              required
              autoComplete='new-password'
            />
          </div>
          <div className='mb-6'>
            <button
              type='submit'
              className=' bg-[#66b2ff] text-white py-3 px-10 w-full rounded-full  hover:hover:bg-blue-500 focus:outline-none       active:transform active:translate-y-1  '
            >
              ログイン
            </button>
          </div>
          <div>
            <p className='text-sm md:text-[15px] text-[#003366] mb-2'>
              <Link href='/#contact'>
                <span className='text-blue-500 underline ml-1'>パスワードお忘れの方</span>
              </Link>
            </p>
            <p className='text-sm md:text-[15px] text-[#003366]'>
              <Link href='/signup'>
                アカウント登録がお済みでない場合は
                <span className='text-blue-500 underline ml-1'>こちら</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
