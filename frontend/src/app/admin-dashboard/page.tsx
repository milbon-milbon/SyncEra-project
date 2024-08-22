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
import SearchBar from '@/components/signup_and_login/SerchBer';
import './globals.css';
import Loading from '../../components/loading';
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
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  // 登録がない管理者はリダイレクトで入れないよにする。
  const checkIfAdmin = async (uid: string): Promise<boolean> => {
    try {
      const companyDoc = await getDoc(doc(db, 'companies', uid));
      return companyDoc.exists();
    } catch (error) {
      clientLogger.error(`==管理者ステータスの確認中にエラーが発生しました==: ${error}`);
      return false;
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkIfAdmin(user.uid);
        if (isAdmin) {
          setAdminEmail(user.email); // 管理者のメールアドレスを設定
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
      setFilteredEmployees(employeesList); // 初期状態はすべて表示
    } catch (error) {
      clientLogger.error(`===社員情報の取得に失敗しました。===:,${error}`);
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

        alert('削除が完了しました');

        // employees と filteredEmployees の両方を更新
        const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
      } catch (error) {
        clientLogger.error(`===削除に失敗しました。===:,${error}`);
        alert('削除に失敗しました。もう一度お試しください。');
      }
    }
  };
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      alert(`ログアウトしました。`);
      clientLogger.info('===ユーザーがログアウトしました===');
      router.push('/');
    } catch (error) {
      clientLogger.error(`===ログアウト中にエラーが発生しました===:,${error}`);
      alert('ログアウトに失敗しました。もう一度お試しください。');
    }
  };
  if (loading) {
    return <Loading />;
  }

  const handleSearch = (keyword: string) => {
    if (keyword.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const lowerKeyword = keyword.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (employee) =>
            employee.name.toLowerCase().includes(lowerKeyword) ||
            employee.department.toLowerCase().includes(lowerKeyword) ||
            employee.role.toLowerCase().includes(lowerKeyword) ||
            employee.email.toLowerCase().includes(lowerKeyword),
        ),
      );
    }
  };
  return (
    <div className='my-custom-font flex min-h-screen text-[17px]  '>
      {/* 左側のナビゲーションエリア */}

      <div className='w-[400px] bg-gray-100 text-[#003366] border-r-[1px] border-[#336699] flex flex-col items-center p-4'>
        <div className='w-full flex flex-col items-center mb-6 bg-gray-200 rounded-lg p-4'>
          <img src='/logo/glay_2.png' alt='Logo' className='h-[70px] mb-1' />

          {adminEmail && (
            <div className='text-[#003366] w-full text-center'>
              <p className='mb-0'>ログイン中の管理者:</p>
              <p className='mb-4 font-bold text-[20px]'>{adminEmail}</p>

              <button
                onClick={handleLogout}
                className='w-[100px] bg-[#66b2ff] text-white py-2 rounded-lg text-[17px] '
              >
                ログアウト
              </button>
            </div>
          )}
        </div>

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
              <img src='/admin-dashboard/home.png' alt='ホーム' className='w-8 h-8 mr-2' />
              利用者権限一覧
            </h1>
            <SearchBar onSearch={handleSearch} />
          </div>
          {/* <p>Loading: {loading ? 'Yes' : 'No'}</p> */}
          {/* <p className='ml-5  mb-8 mt-5 '>Number of employees: {employees.length}</p> */}
          <p className='ml-5 mb-8 mt-5'>Number of employees: {filteredEmployees.length}</p>
          <table className='min-w-full bg-white text-center '>
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
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className='py-2'>{employee.name}</td>
                  <td className='py-2'>{employee.department}</td>
                  <td className='py-2'>{employee.role}</td>
                  <td className='py-2'>{employee.email}</td>
                  <td className='py-2'>
                    <Link href={`/admin-dashboard/update-employee?employeeId=${employee.id}`}>
                      <button className='bg-[#66b2ff] text-white py-2  px-4   hover:bg-blue-500 text-[17px]  rounded-lg mr-2 font-normal'>
                        更新
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(employee.id)}
                      className='bg-[#7FBF7F] text-white hover:bg-[#377a00]  py-2 px-4  text-[17px] rounded-lg font-normal'
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>{' '}
        </div>
      </div>
    </div>
  );
}
