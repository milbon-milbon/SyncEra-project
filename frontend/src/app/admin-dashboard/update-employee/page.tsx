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
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // 追加すると、ログイン状態の直接入力はじく
  useEffect(() => {
    // setLoading(false);
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (currentUser) {
      setAdminEmail(currentUser.email || ''); // 管理者のメールアドレスを設定
    } else {
      router.push('/login/company');
    }
  }, [router]);

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

  //   return (
  //     <div className='min-h-screen p-4'>
  //       <h1 className='text-2xl font-bold mb-4'>社員情報更新</h1>
  //       <form onSubmit={handleSubmit} className='bg-white p-4 rounded shadow'>
  //         <div className='mb-4'>
  //           <label className='block text-gray-700'>氏名</label>
  //           <input
  //             type='text'
  //             value={employee.name}
  //             onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
  //             className='w-full border p-2 rounded'
  //             required
  //           />
  //         </div>
  //         <div className='mb-4'>
  //           <label className='block text-gray-700'>部署</label>
  //           <select
  //             value={employee.department}
  //             onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
  //             className='w-full border p-2 rounded'
  //             required
  //           >
  //             {departments.map((dept) => (
  //               <option key={dept} value={dept}>
  //                 {dept}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <div className='mb-4'>
  //           <label className='block text-gray-700'>役職</label>
  //           <select
  //             value={employee.role}
  //             onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
  //             className='w-full border p-2 rounded'
  //             required
  //           >
  //             {positions.map((pos) => (
  //               <option key={pos} value={pos}>
  //                 {pos}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <div className='mb-4'>
  //           <label className='block text-gray-700'>メールアドレス</label>
  //           <input
  //             type='email'
  //             value={employee.email}
  //             onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
  //             className='w-full border p-2 rounded'
  //             required
  //           />
  //         </div>
  //         <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
  //           更新
  //         </button>
  //         <Link href='/admin-dashboard'>
  //           <button className='bg-gray-300 text-black py-2 px-4 rounded ml-2'>戻る</button>
  //         </Link>
  //       </form>
  //     </div>
  //   );
  // }

  async function getCompanyId(): Promise<string | null> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      return user.uid;
    }
    return null;
  }
  return (
    <div className='flex min-h-screen text-[20px]  '>
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
              <img src='/admin-dashboard/update.png' alt='新規登録' className='w-8 h-8 mr-2' />
              メンバー更新画面
            </h1>
          </div>
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
            <button className='bg-[#66b2ff] text-white py-2  px-4   hover:bg-blue-500 text-[17px]  rounded-lg mr-2 font-normal'>
              更新
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
