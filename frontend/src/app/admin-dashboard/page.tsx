// frontend/src/app/admin-dashboard/page.tsx===社員登録管理画面＝＝＝
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import app from '@/firebase/config';
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 登録がない管理者はリダイレクトで入れないよにする。
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(`Authenticated user: ${user.uid}`);
        const isAdmin = await checkIfAdmin(user.uid);
        if (isAdmin) {
          // 管理者かどうかを確認
          fetchEmployees(user.uid);
        } else {
          console.log('User is not an admin');
          router.push('/login/employee'); // 一般社員用のログインページへリダイレクト
        }
      } else {
        console.log('No authenticated user');
        router.push('/login/company');
      }
    });
    return () => unsubscribe();
  }, [router]);
  const checkIfAdmin = async (uid: string) => {
    const companyDoc = await getDoc(doc(db, 'companies', uid));
    return companyDoc.exists();
  };

  const fetchEmployees = async (companyId: string) => {
    setLoading(true);
    try {
      const employeesRef = collection(db, `companies/${companyId}/employees`);
      console.log(`Fetching employees from: ${employeesRef.path}`);
      const snapshot = await getDocs(employeesRef);
      console.log(`Number of employees found: ${snapshot.docs.length}`);

      const employeesList: Employee[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string,
        department: doc.data().department as string,
        role: doc.data().role as string,
        email: doc.data().email as string,
      }));
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('社員情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: string) => {
    const confirmation = confirm('削除しますか？');
    if (confirmation) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('ユーザーが認証されていません。');

        await deleteDoc(doc(db, `companies/${user.uid}/employees`, employeeId));
        alert('削除が完了しました');
        setEmployees(employees.filter((employee) => employee.id !== employeeId));
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('削除に失敗しました。もう一度お試しください。');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>登録社員一覧</h1>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Number of employees: {employees.length}</p>
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
