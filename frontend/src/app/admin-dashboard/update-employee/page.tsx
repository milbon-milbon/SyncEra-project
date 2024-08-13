// frontend/src/app/admin-dashboard/update-employee.tsx＝＝社員更新＝＝
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateEmployee, getEmployee } from '@/services/employeeService';
import { getAuth } from 'firebase/auth';
import clientLogger from '@/lib/clientLogger';
import Link from 'next/link';
import app from '@/firebase/config'; // Firebase 初期化ファイルをインポート

// 部署のリスト
const departments = ['営業部', '技術部', '人事部', '財務部', 'その他'];

// 役職のリスト（例として追加）
const positions = ['manager', 'staff', 'その他'];

interface Employee {
  name: string;
  department: string;
  role: string;
  email: string;
}

export default function UpdateEmployee() {
  const [employee, setEmployee] = useState<Employee>({
    name: '',
    department: departments[0], // デフォルト値を設定
    role: positions[0], // デフォルト値を設定
    email: '',
  });
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
    const fetchEmployee = async () => {
      const companyId = localStorage.getItem('companyId');
      if (companyId && employeeId) {
        try {
          const data = await getEmployee(companyId, employeeId);
          if (data) {
            setEmployee(data as Employee);
          } else {
            clientLogger.error('Employee data not found.');
          }
        } catch (error) {
          clientLogger.error(`Error fetching employee data:, ${error}`);
        }
      }
    };
    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      try {
        const companyId = await getCompanyId();
        if (companyId) {
          await updateEmployee(companyId, employeeId, employee);
          alert('更新が完了しました');
          router.push('/admin-dashboard');
        } else {
          throw new Error('Company ID not found.');
        }
      } catch (error) {
        clientLogger.error(`Error updating employee:, ${error}`);
        alert('更新に失敗しました。もう一度お試しください。');
      }
    }
  };
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className='min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>社員情報更新</h1>
      <form onSubmit={handleSubmit} className='bg-white p-4 rounded shadow'>
        <div className='mb-4'>
          <label className='block text-gray-700'>氏名</label>
          <input
            type='text'
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>部署</label>
          <select
            value={employee.department}
            onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
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
            value={employee.role}
            onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
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
            value={employee.email}
            onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
          更新
        </button>
        <Link href='/admin-dashboard'>
          <button className='bg-gray-300 text-black py-2 px-4 rounded ml-2'>戻る</button>
        </Link>
      </form>
    </div>
  );
}

async function getCompanyId(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
  return null;
}
