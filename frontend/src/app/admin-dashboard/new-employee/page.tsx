// frontend/src/app/admin-dashboard/new-employee.tsx==社員新規登録==
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addEmployee } from '@/services/employeeService'; // サービスに分離
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '@/firebase/config'; // Firebase 初期化ファイルをインポート

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

  // 追加すると、ログイン状態の直接入力はじく
  // useEffect(() => {
  //   setLoading(false);
  //   const auth = getAuth(app);
  //   const currentUser = auth.currentUser;

  //   if (!currentUser) {
  //     router.push('/login/company');
  //   }
  // }, [router]);

  useEffect(() => {
    const auth = getAuth(app);
    // const currentUser = auth.currentUser;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        clientLogger.info('未認証ユーザーがNewEmployeeページにアクセスしようとしました');
        router.push('/login/company');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ログインしているユーザーの companyId を取得
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const companyId = currentUser.uid;
      const employeeData = { name, department, role, email, password };

      try {
        await addEmployee(companyId, employeeData);
        // サインイン後、管理者ダッシュボードにリダイレクト
        clientLogger.info('新規社員が正常に登録されました');
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
    <div className='min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>新規社員登録</h1>
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
        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
          登録
        </button>
      </form>
      <Link href='/admin-dashboard'>戻る</Link>
    </div>
  );
}
