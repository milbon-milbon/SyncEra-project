// frontend/src/app/admin-dashboard/update-employee.tsx＝＝社員更新＝＝
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateEmployee, getEmployee } from '@/services/employeeService';
import { getAuth } from 'firebase/auth';

interface Employee {
  name: string;
  department: string;
  role: string;
  email: string;
}

export default function UpdateEmployee() {
  const [employee, setEmployee] = useState<Employee>({
    name: '',
    department: '',
    role: '',
    email: '',
  });
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const router = useRouter();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        const data = await getEmployee(employeeId);
        if (data) {
          setEmployee(data as Employee);
        } else {
          console.error('Employee data not found.');
        }
      }
    };
    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      const companyId = await getCompanyId(); // companyIdを適切に取得する関数を実装
      if (companyId) {
        await updateEmployee(companyId, employeeId, employee);
        alert('更新が完了しました');
        router.push('/admin-dashboard');
      } else {
        console.error('Company ID not found.');
      }
    }
  };

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
          <input
            type='text'
            value={employee.department}
            onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
            className='w-full border p-2 rounded'
            required
          />
        </div>
        {/* 他のフィールドも同様に追加 */}
        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
          更新
        </button>
      </form>
    </div>
  );
}

// この関数は、companyIdを適切に取得するために実装する必要があります。
// ログインユーザーから取得するか、別の方法で取得します。
async function getCompanyId(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user.uid; // ここでは例としてユーザーのUIDをcompanyIdとして使用しています。
  }
  return null;
}
