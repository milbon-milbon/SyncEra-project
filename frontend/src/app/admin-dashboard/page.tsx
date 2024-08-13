// frontend/src/app/admin-dashboard/page.tsx===社員登録管理画面＝＝＝
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import app from '@/firebase/config';
import Link from 'next/link';
import clientLogger from '@/lib/clientLogger';
import { getFunctions, httpsCallable } from 'firebase/functions';
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
  const checkIfAdmin = async (uid: string): Promise<boolean> => {
    try {
      const companyDoc = await getDoc(doc(db, 'companies', uid));
      return companyDoc.exists();
    } catch (error) {
      clientLogger.error(`Error checking admin status: ${error}`);
      return false;
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkIfAdmin(user.uid);
        if (isAdmin) {
          localStorage.setItem('companyId', user.uid);
          fetchEmployees(user.uid);
        } else {
          router.push('/login/company');
        }
      } else {
        router.push('/login/company');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchEmployees = async (companyId: string) => {
    setLoading(true);
    try {
      const employeesRef = collection(db, `companies/${companyId}/employees`);
      clientLogger.debug(`Fetching employees from: ${employeesRef.path}`);
      const snapshot = await getDocs(employeesRef);
      clientLogger.debug(`Number of employees found: ${snapshot.docs.length}`);

      const employeesList: Employee[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string,
        department: doc.data().department as string,
        role: doc.data().role as string,
        email: doc.data().email as string,
      }));
      setEmployees(employeesList);
    } catch (error) {
      clientLogger.error(`Error fetching employees:,${error}`);
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

        const functions = getFunctions(app);
        const deleteUserAndDataFunction = httpsCallable(functions, 'deleteUserAndData');

        const result = await deleteUserAndDataFunction({ employeeId, companyId: user.uid });
        console.log('削除:', result.data);

        alert('削除が完了しました');
        setEmployees(employees.filter((employee) => employee.id !== employeeId));
      } catch (error) {
        clientLogger.error(`Error deleting employee:,${error}`);
        alert('削除に失敗しました。もう一度お試しください。');
      }
    }
  };
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      clientLogger.info('ユーザーがログアウトしました');
      router.push('/');
    } catch (error) {
      clientLogger.error(`ログアウト中にエラーが発生しました:,${error}`);
      alert('ログアウトに失敗しました。もう一度お試しください。');
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
      <button onClick={handleLogout} className='bg-red-500 text-white py-2 px-4 rounded'>
        ログアウト
      </button>
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
      <Link href='/'>戻る</Link>
    </div>
  );
}
