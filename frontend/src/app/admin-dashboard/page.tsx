// frontend/src/app/admin-dashboard/page.tsx===社員登録管理画面＝＝＝
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '@/firebase/config'; // Firebase 初期化
import Link from 'next/link';

const db = getFirestore(app);

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();

  // 登録がない管理者はリダイレクトで入れないよにする。
  useEffect(() => {
    const fetchEmployees = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        router.push('/admin-dashboard');
        {
          /* TODO：後で/login/companyに変更 */
        }
        return;
      }

      const employeesRef = collection(db, `companies/${user.uid}/employees`);
      const snapshot = await getDocs(employeesRef);
      const employeesList: Employee[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string,
        department: doc.data().department as string,
        role: doc.data().role as string,
        email: doc.data().email as string,
      }));
      setEmployees(employeesList);
    };

    fetchEmployees();
  }, [router]);

  const handleDelete = async (employeeId: string) => {
    const confirmation = confirm('削除しますか？');
    if (confirmation) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, `companies/${user.uid}/employees`, employeeId));
        alert('削除が完了しました');
        setEmployees(employees.filter((employee) => employee.id !== employeeId));
      }
    }
  };

  return (
    <div className='min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>登録社員一覧</h1>
      <Link href='/admin-dashboard/new-employee'>
        <button className='bg-blue-500 text-white py-2 px-4 rounded mb-4'>新規登録</button>
      </Link>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2'>氏名</th>
            <th className='py-2'>部署</th>
            <th className='py-2'>役職</th>
            <th className='py-2'>メール</th>
            <th className='py-2'>アクション</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className='py-2'>{employee.name}</td>
              <td className='py-2'>{employee.department}</td>
              <td className='py-2'>{employee.role}</td>
              <td className='py-2'>{employee.email}</td>
              <td className='py-2'>
                <Link href={`/admin-dashboard/update-employee?employeeId=${employee.id}`}>
                  <button className='bg-yellow-500 text-white py-1 px-2 rounded mr-2'>更新</button>
                </Link>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className='bg-red-500 text-white py-1 px-2 rounded'
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
