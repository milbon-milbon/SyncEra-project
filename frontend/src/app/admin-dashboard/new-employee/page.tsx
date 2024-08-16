// frontend/src/app/admin-dashboard/new-employee.tsx==社員新規登録==
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addEmployee } from '@/services/employeeService'; // サービスに分離
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '@/firebase/config'; // Firebase 初期化ファイルをインポート
import '@/app/admin-dashboard/globals.css';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'; //新規社員登録後に、管理者アカウントに自動的に再ログイン

import clientLogger from '@/lib/clientLogger';
import Link from 'next/link';
// 部署のリスト（例）
const departments = ['営業部', '技術部', '人事部', '財務部', 'その他'];

// 役職のリスト
const positions = ['manager', 'staff', 'その他'];

export default function NewEmployee() {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [role, setRole] = useState(positions[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminEmail(user.email);
        setLoading(false);
      } else {
        clientLogger.info('未認証ユーザーがNewEmployeeページにアクセスしようとしました');
        router.push('/login/company');
        // ここでreturnを追加して、以降のコードの実行を防ぐ
        return;
      }
    });

    return () => unsubscribe();
  }, [router]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   // ログインしているユーザーの companyId を取得
  //   const auth = getAuth();
  //   const currentUser = auth.currentUser;

  //   if (currentUser) {
  //     const companyId = currentUser.uid;
  //     const employeeData = { name, department, role, email, password };

  //     try {
  //       await addEmployee(companyId, employeeData);
  //       // サインイン後、管理者ダッシュボードにリダイレクト
  //       clientLogger.info('新規社員が正常に登録されました');
  //       alert('新規社員が正常に登録されました');
  //       router.push('/admin-dashboard');
  //     } catch (error: any) {
  //       clientLogger.error(`社員登録エラー: ${error.message}`);
  //       setError('登録に失敗しました。もう一度お試しください。');
  //       clientLogger.error(`詳細なエラー情報:,${error}`);
  //     }
  //   } else {
  //     setError('認証エラーが発生しました。再度ログインしてください。');
  //     router.push('/login/company');
  //   }
  // };
  //修正案
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const companyId = currentUser.uid;
      const employeeData = { name, department, role, email, password };

      try {
        await addEmployee(companyId, employeeData);
        clientLogger.info('新規社員が正常に登録されました');
        alert('新規社員が正常に登録されました');

        // 新規社員をログアウトさせ、元の管理者アカウントでログインしなおす
        const adminEmail = currentUser.email;
        const adminPassword = prompt('再度管理者パスワードを入力してください:');

        if (adminPassword) {
          await signOut(auth);
          await signInWithEmailAndPassword(auth, adminEmail!, adminPassword);
          clientLogger.info('管理者が再ログインしました');
          console.log('Admin successfully re-logged in as:', adminEmail);
        }

        // ログイン後、管理者ダッシュボードにとどまる
        router.push('/admin-dashboard');
      } catch (error: any) {
        clientLogger.error(`社員登録エラー: ${error.message}`);
        setError('登録に失敗しました。もう一度お試しください。');
        clientLogger.error(`詳細なエラー情報:,${error}`);
      }
    } else {
      setError('認証エラーが発生しました。再度ログインしてください。');
      router.push('/login/company');
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='my-custom-font flex min-h-screen text-[17px]   '>
      {/* 左側のナビゲーションエリア */}

      <div className='w-[400px] bg-gray-100 text-[#003366] border-r-[1px] border-[#336699] flex flex-col items-center p-4'>
        <div className='w-full flex flex-col items-center mb-6 bg-gray-200 rounded-lg p-4'>
          <img src='/logo/glay_2.png' alt='Logo' className='h-[70px] mb-1' />

          {adminEmail && (
            <div className='text-[#003366] w-full text-center'>
              <p className='mb-0'>ログイン中の管理者:</p>
              <p className='mb-4 font-bold text-[20px]'>{adminEmail}</p>
            </div>
          )}
        </div>
        <Link
          href='/admin-dashboard'
          className='w-full py-2 mb-4 border-b-[2px] border-gray-300 flex items-center block'
        >
          <span className='mr-2 '>
            <img src='/admin-dashboard/home.png' alt='ホーム' className='w-8 h-8' />{' '}
            {/* ホームアイコン */}
          </span>
          ホーム
        </Link>

        <Link
          href='/admin-dashboard/new-employee'
          className='w-full text py-2 mb-4 border-b-[2px] border-gray-300 flex items-center items-center block'
        >
          <span className='mr-2'>
            <img src='/admin-dashboard/person_add.png' alt='新規登録' className='w-8 h-8' />{' '}
            {/* 新規登録アイコン */}
          </span>
          新規登録
        </Link>

        <Link
          href='/admin-dashboard'
          className='w-full text py-2 mb-4 border-b-[2px] border-gray-300 flex  items-center block'
        >
          <span className='mr-2'>
            <img src='/admin-dashboard/settings.png' alt='各種設定' className='w-8 h-8' />{' '}
            {/* 各種設定アイコン */}
          </span>
          各種設定
        </Link>

        <Link
          href='/'
          className='w-full text py-2 flex  border-b-[2px] border-gray-300  items-center block'
        >
          <span className='mr-2'>
            <img src='/admin-dashboard/assignment.png' alt='アプリTOP' className='w-8 h-8' />{' '}
            {/* アプリTOPアイコン */}
          </span>
          アプリTOP
        </Link>
      </div>

      {/* 右側のメインコンテンツエリア */}

      <div className='w-full flex flex-col text-[#003366] bg-white'>
        {/* 上部に社員一覧 */}
        <div className='flex-1 p-0 overflow-y-auto'>
          <div className='w-full bg-[#003366] text-white p-4 flex items-center justify-between'>
            <h1 className='text-3xl font-bold mb-4 mt-5 flex items-center'>
              <img src='/admin-dashboard/person_add.png' alt='新規登録' className='w-8 h-8 mr-2' />
              新規登録
            </h1>
          </div>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          <form onSubmit={handleSubmit} className='bg-white p-4 rounded shadow' autoComplete='off'>
            {/* 各入力フィールド */}
            <div className='mb-4'>
              <label className='block text-gray-700'>氏名</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full border p-2 rounded'
                required
              />
            </div>
            {/* 他のフィールドも同様に追加 */}
            <div className='mb-4'>
              <label className='block text-gray-700'>部署</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className='w-full border p-2 rounded'
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700'>役職</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full border p-2 rounded'
                required
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>メールアドレス</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border p-2 rounded'
                required
                autoComplete='new-email'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>パスワード</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border p-2 rounded'
                required
                autoComplete='new-password'
              />
            </div>
            <button className='bg-[#66b2ff] text-white py-2  px-4   hover:bg-blue-500 text-[17px]  rounded-lg mr-2 font-normal'>
              登録
            </button>
            <Link href='/admin-dashboard'>
              <button className='bg-gray-300   hover:bg-[#c0c0c0] text-black py-2 px-4 rounded-lg ml-2 text-[17px]'>
                戻る
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
