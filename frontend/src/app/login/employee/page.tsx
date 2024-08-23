// frontend/src/app/login/employee/page.tsx==社員ログイン==
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config'; // Firebase 初期化ファイルをインポート
import clientLogger from '@/lib/clientLogger';
import { httpsCallable, getFunctions } from 'firebase/functions';
import app from '@/firebase/config';
import '@/app/login/globals.css';
import Link from 'next/link';
import Loading from '@/components/loading';
import LogoWhite from '@/components/employeelist/LogoWhite';
export default function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await checkUserAndRedirect(user);
        } catch (error) {
          clientLogger.error(`Error checking user status:, ${error}`);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const checkUserAndRedirect = async (user: User) => {
    try {
      const idTokenResult = await user.getIdTokenResult();
      const companyId = idTokenResult.claims.companyId as string | undefined;

      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const employeeRef = doc(db, `companies/${companyId}/employees`, user.uid);
      const employeeDoc = await getDoc(employeeRef);

      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data() as DocumentData;
        redirectToDashboard(employeeData.role);
      } else {
        throw new Error('Employee data not found');
      }
    } catch (error) {
      clientLogger.error(`Error in checkUserAndRedirect:,${error}`);
      throw error;
    }
  };
  // 役職に基づいて適切な画面に遷移
  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'manager':
        router.push('/employee-list');
        break;
      case 'mentor':
        router.push('/mentor-dashboard');
        break;
      default:
        router.push('/employee-dashboard');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        alert('ユーザー情報を取得できませんでした。');
        return;
      }

      // ログインしている会社の会社IDを取得;
      const idTokenResult = await user.getIdTokenResult();
      const companyId = idTokenResult.claims.companyId;

      clientLogger.debug(`User UID:, ${user.uid}`);
      clientLogger.debug(`Company ID:,${companyId}`);

      // Firestoreから社員情報を取得
      const employeeRef = doc(db, `companies/${companyId}/employees`, user.uid);
      const employeeDoc = await getDoc(employeeRef);

      clientLogger.debug(`===職員のドキュメントパス===:, ${employeeRef.path}`);
      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data() as DocumentData;
        clientLogger.debug(`===職員のドキュメントデータ===: ${JSON.stringify(employeeData)}`);
        clientLogger.debug(`===職員のドキュメント取得成功===: ${JSON.stringify(employeeData)}`);

        // カスタムクレームを設定
        const functions = getFunctions(app);
        const setCustomClaims = httpsCallable(functions, 'setCustomClaims');
        await setCustomClaims({ uid: user.uid, companyId: employeeData.companyId });

        // トークンを強制的に更新
        await user.getIdToken(true);

        if (!companyId || companyId === 'defaultCompanyId') {
          clientLogger.error('===会社IDが見つかりません。===');
          alert('会社IDが見つかりません。');
          return;
        }

        redirectToDashboard(employeeData.role);
      } else {
        clientLogger.debug(`社員情報が見つかりません。ドキュメントID: ${user.uid}`);
        alert('社員情報が見つかりません。管理者に連絡してください。');
      }
    } catch (error: any) {
      clientLogger.error(`Login failed: ${error.message}`);
      alert('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className='my-custom-font flex flex-col min-h-screen bg-white '>
      <header className='bg-white text-[#003366]p-4 md:p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <img
            src='/logo/white_2.png'
            alt='SyncEra Logo'
            className='h-[65px] w-[207px] mt-2 ml-2'
          />

          <div className='flex items-center space-x-2'>
            <Link href='/'>
              <button className='bg-gray-200 text-[#003366] border  px-4 py-2 rounded hover:bg-gray-300 active:transform active:translate-y-1 transition-colors duration-300'>
                ホーム
              </button>
            </Link>
            <span className='text-[#003366]'> 〉</span>
            <span className='text-[#003366] text-[20px] font-bold'>ログイン画面</span>
          </div>
        </div>
      </header>
      {/* ログインを配置 */}
      <form
        className='bg-white p-4 md:p-8 rounded-lg shadow-2xl w-full max-w-md border-4 border-[#66b2ff] mx-auto mt-8'
        onSubmit={handleSubmit}
        autoComplete='off'
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
            className='shadow appearance-none border rounded w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline'
            required
            autoComplete='new-email'
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
            className=' shadow appearance-none border rounded w-full py-3 px-3 text-[#003366] text-[17px] leading-tight focus:outline-none focus:shadow-outline'
            autoComplete='new-password'
          />
        </div>
        <div className='flex justify-center mb-2'>
          <button
            type='submit'
            className=' bg-[#003366] text-white py-3 px-10 w-full rounded-full  hover:bg-[#002244] focus:outline-none'
          >
            ログイン
          </button>{' '}
          {error && <p className='text-red-500 mb-4'>{error}</p>}
        </div>
        <div className='w-full p-[5px]'>
          <p className='text-[15px] text-[#003366]'>
            ID・パスワードは、管理者へお問い合わせください。
          </p>
        </div>
      </form>
    </div>
  );
}
