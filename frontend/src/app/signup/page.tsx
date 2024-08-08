// frontend/src/app/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '@/firebase/config';
import LogoWblue from '@/components/payment/LogoWblue';
import clientLogger from '@/lib/clientLogger';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clientLogger.info('フォームが送信されました'); // フォーム送信のログ
    try {
      // パスワードの代わりにランダムな文字列を生成
      const temporaryPassword = Math.random().toString(36).slice(-8);
      clientLogger.info('ランダムパスワードが生成されました'); // パスワード生成のログ

      const userCredential = await createUserWithEmailAndPassword(auth, email, temporaryPassword);
      const user = userCredential.user;
      clientLogger.info(`ユーザー登録成功: ${user.uid}`); // ユーザー登録成功のログ

      await setDoc(doc(db, 'companies', user.uid), {
        companyName,
        email,
        firstName,
        lastName,
      });
      clientLogger.info(`Firestoreにユーザー情報を保存しました: ${user.uid}`); // Firestore保存のログ
      router.push('/pricing'); // サインアップ後に/pricingページに遷移
    } catch (error) {
      console.error('Error signing up:', error);
      clientLogger.error('サインアップエラー: '); // エラーログ
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
      <LogoWblue />
      {/* 登録フォームを配置 */}
      <form className='bg-gray-100 p-6 rounded-lg shadow-lg max-w-md' onSubmit={handleSubmit}>
        <h1 className='text-center text-2xl font-bold mb-3 text-[#003366]'>ご登録フォーム</h1>
        {/* フォーム要素例 */}
        <div className='mb-4'>
          <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='companyName'>
            社名・団体名
          </label>
          <input
            type='text'
            id='companyName'
            name='companyName'
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className='input-with-icon-1 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='office_name'
            required
            autoComplete='off'
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
              name='lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='input-with-icon-2 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
              placeholder='name'
              required
              autoComplete='off'
            />
          </div>
          <div className='w-1/2'>
            <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='firstName'>
              名
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
              placeholder=''
              required
              autoComplete='off'
            />
          </div>
        </div>
        <div className='mb-10'>
          <label className='block text-[#003366] text-sm font-bold mb-2' htmlFor='email'>
            メールアドレス
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input-with-icon-3 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='email'
            required
            autoComplete='off'
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className=' bg-[#66b2ff] text-white py-2 px-[180px] rounded-full hover:bg-[#99ccff] focus:outline-none'
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
}
