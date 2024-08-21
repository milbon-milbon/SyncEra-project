'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type EmployeeInfo = {
  department: string;
  email: string;
  id: string;
  name: string;
  project: string;
  role: string;
  slack_user_id: string;
};

type DailyReport = {
  id: number;
  text: string;
  ts: string;
  user_id: string;
};

type EmployeeData = [EmployeeInfo, DailyReport];

export default function EmployeeDetailPage() {
  const params = useParams();
  const slack_user_id = params.slack_user_id as string;
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployeeData() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/client/selected_employee/${slack_user_id}/`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch employee data: ${response.status}`);
        }
        const data = await response.json();
        setEmployeeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (slack_user_id) {
      fetchEmployeeData();
    }
  }, [slack_user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employeeData) {
    return <div>従業員データが見つかりません</div>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-3xl font-bold mb-8">
          <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-13" />
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                href="/employee-list"
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
                社員一覧
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
                ホームページへ戻る
              </Link>
            </li>
          </ul>
        </nav>
        <Link
          href="/login"
          className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto inline-block text-center"
        >
          ログアウト
        </Link>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
          <h2 className="text-3xl font-bold mb-4 text-[#003366]">{employeeData[0].name}の日報</h2>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2 text-[#003366]">社員情報</h3>
            <p className="text-[#333333]">
              <strong>部署:</strong> {employeeData[0].department}
            </p>
            <p className="text-[#333333]">
              <strong>プロジェクト:</strong> {employeeData[0].project}
            </p>
            <p className="text-[#333333]">
              <strong>役職:</strong> {employeeData[0].role}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-[#003366]">最新の日報</h3>
            <p className="text-lg text-[#333333] whitespace-pre-wrap">{employeeData[1].text}</p>
            <p className="text-sm text-gray-500 mt-2">
              投稿日時:{' '}
              {(() => {
                const timestamp = parseFloat(employeeData[1].ts);
                const date = new Date(timestamp * 1000);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
              })()}
            </p>
            <div className="mt-4">
              <Link
                href={`/employee-list/summaried_report/${slack_user_id}`}
                className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 inline-block"
              >
                日報サマリーを見る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}