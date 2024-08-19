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
import Loading from '@/app/components/loading';
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
          case 'auth/wrong-password':
            alert('パスワードが間違っています。再度お試しください。');
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
    <div className='my-custom-font flex flex-col min-h-screen bg-white'>
      <header className='bg-[#003366] text-white p-8 flex justify-between items-center'>
        <div className='flex items-center space-x-6'>
          <Link href='/'>
            <img src='/image/SyncEra(blue_white).png' alt='SyncEra Logo' className='h-16' />
          </Link>
          <div className='flex items-center space-x-6'>
            <Link href='/'>
              <button className='bg-white text-[#003366] border border-[#003366] px-4 py-2 rounded hover:bg-gray-200 active:transform active:translate-y-1 transition-colors duration-300'>
                TOP
              </button>
            </Link>
            <span className='text-white'> 〉</span>
            <span className='text-white text-[20px]'>管理画面（ログイン）</span>
          </div>
        </div>
      </header>

      {/* ログインを配置 */}
      <form
        className='absolute left-[50%] top-[250px] translate-x-[-50%] w-full max-w-[300px]'
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        <div className='flex flex-col items-center mb-2'>
          <div className='w-full p-[0px] '>
            <label className='block text-[#003366] text-[17px]  mb-2' htmlFor='email'>
              ID(メールアドレス)
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='メールアドレスを入力してください'
              className='shadow appearance-none border rounded mb-8 shadow-md w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline shadow-custom focus:ring focus:ring-[#66b2ff] focus:border-[#66b2ff]'
              required
              autoComplete='new-email'
            />
          </div>
          <div className='w-full p-[0px] mb-[50px]'>
            <label className='block text-[#003366] text-[17px]  mb-2' htmlFor='password'>
              パスワード
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='パスワードを入力してください'
              className='shadow appearance-none border rounded shadow-md w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline shadow-custom focus:ring focus:ring-[#66b2ff] focus:border-[#66b2ff]'
              required
              autoComplete='new-password'
            />
          </div>
          <div className='w-full items-center p-[0px] mb-0 '>
            <button
              type='submit'
              className='w-full bg-[#66b2ff] text-white text-[17px] py-2 px-3 rounded-full hover:bg-[#99ccff] focus:outline-none'
            >
              ログイン
            </button>
          </div>
        </div>
        <div className='w-full p-[5px]'>
          <p className='text-[15px] text-[#003366]'>
            <Link href='/#contact'>
              <span className='text-blue-500 underline ml-1'>パスワードお忘れの方</span>
            </Link>
          </p>
          <p className='text-[15px] text-[#003366]'>
            <Link href='/signup'>
              アカウント登録がお済みでない場合は
              <span className='text-blue-500 underline ml-1'>こちら</span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
