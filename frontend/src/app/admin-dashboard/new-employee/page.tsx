// frontend/src/app/admin-dashboard/new-employee.tsx==新規登録==
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addEmployee } from '@/services/employeeService'; // サービスに分離
import { getAuth } from 'firebase/auth';

export default function NewEmployee() {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ログインしているユーザーの companyId を取得
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const companyId = user.uid; // companyId はログイン中のユーザーの UID として取得
      const employeeData = { name, department, role, email, password };

      await addEmployee(companyId, employeeData); // companyId を引数として渡す
      alert('登録が完了しました');
      router.push('/admin-dashboard');
    } else {
      console.error('ユーザーが認証されていません。');
    }
  };

  return (
    <div className='min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>新規社員登録</h1>
      <form onSubmit={handleSubmit} className='bg-white p-4 rounded shadow'>
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
          <input
            type='text'
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>役職</label>
          <input
            type='text'
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>メールアドレス</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border p-2 rounded'
            required
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
          />
        </div>
        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
          登録
        </button>
      </form>
    </div>
  );
}
