// frontend/src/app/login/employee/page.tsx==社員ログイン==
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import LogoWblue from '@/components/payment/LogoWblue';
import clientLogger from '@/lib/clientLogger';

export default function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ログインしている会社の会社IDを取得
      const idTokenResult = await user.getIdTokenResult();
      const companyId = idTokenResult.claims.companyId;

      // Firestoreから社員情報を取得
      const db = getFirestore();
      const employeeDoc = await getDoc(doc(db, `companies/${companyId}/employees`, user.uid));

      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data();
        clientLogger.info('Employee login successful');

        // 役職に基づいて適切な画面に遷移
        switch (
          employeeData.role // `position` ではなく、`role` で確認する
        ) {
          case 'manager':
            router.push('/signup'); // 管理者ダッシュボードへの遷移に変更
            break;
          case 'staff':
            router.push('/staff-dashboard');
            break;
          default:
            router.push('/employee-dashboard');
        }
      } else {
        setError('社員情報が見つかりません。管理者に連絡してください。');
        clientLogger.error('===社員情報が見つかりません。===');
      }
    } catch (error: any) {
      clientLogger.error(`Login failed: ${error.message}`);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
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
            ログイン
          </button>{' '}
          {error && <p className='text-red-500 mb-4'>{error}</p>}
        </div>
      </form>
    </div>
  );
}
