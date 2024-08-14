'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  project: string;
  slack_user_id: string;
  imageUrl?: string;
};

export default function EmployeeList() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { employees, loading, error } = useEmployees();

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleViewDetails = (slackUserId: string) => {
    try {
      router.push(`/employee-list/summary/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleOneOnOneAdvice = (slackUserId: string) => {
    try {
      router.push(`/employee-list/OneOnOneAdvice/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleCareerSurveyResults = (slackUserId: string) => {
    try {
      router.push(`/employee-list/career-survey/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-3xl font-bold mb-8">
          <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-13" />
        </div>
        <nav className="flex-1">
          <ul className="space-y-6">
            <li>
              <Link
                href="/employee-list/employee_registration"
                className="block text-lg text-white hover:underline"
              >
                社員登録
              </Link>
            </li>
            <li>
              <Link href="/" className="block text-lg text-white hover:underline">
                ホームページへ戻る
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
          onClick={handleLoginLogout}
        >
          {isLoggedIn ? 'ログアウト' : 'ログイン'}
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-[#003366] mb-8">社員一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white p-6 rounded-lg shadow-md flex items-start relative border border-gray-300"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#003366] mb-2">{employee.name}</h2>
                <p className="text-sm text-[#333333] mb-1">部署: {employee.department}</p>
                <p className="text-sm text-[#333333] mb-1">役職: {employee.role}</p>
                <p className="text-sm text-[#333333] mb-4">担当案件名: {employee.project}</p>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => handleViewDetails(employee.slack_user_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300"
                  >
                    日報を見る
                  </button>
                  <button
                    onClick={() => handleOneOnOneAdvice(employee.slack_user_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300"
                  >
                    1on1 アドバイス
                  </button>
                  <button
                    onClick={() => handleCareerSurveyResults(employee.slack_user_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300"
                  >
                    キャリアアンケート結果を見る
                  </button>
                </div>
              </div>
              <div className="w-32 h-32 ml-4 border border-gray-300 rounded-lg overflow-hidden">
                {employee.imageUrl ? (
                  <img
                    src={employee.imageUrl}
                    alt={`${employee.name}のSlackアイコン`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg shadow-md w-full h-32 flex items-center justify-center">
                    画像なし
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
