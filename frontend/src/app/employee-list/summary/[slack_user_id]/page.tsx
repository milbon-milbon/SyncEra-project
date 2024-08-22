'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackEmployee from '@/components/employeelist/BackEmployee';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import LinkOneOnOne from '@/components/employeelist/LinkOneOnOne';
import LinkCareerQuestion from '@/components/employeelist/LinkCareerQuestion';
import Loading from '@/components/loading';

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
        const response = await fetch(`${apiUrl}/client/selected_employee/${slack_user_id}/`);
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
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employeeData) {
    return <div>従業員データが見つかりません</div>;
  }

  return (
    <div className='min-h-screen flex'>
      <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
        <div className='text-3xl font-bold mb-8'>
          <img src='/image/SyncEra(blue_white).png' alt='SyncEra Logo' className='h-13' />
        </div>
        <nav className='flex-1'>
          <ul className='space-y-4'>
            <li>
              <Link
                href='/employee-list'
                className='block text-lg text-white hover:text-white hover:underline transition-colors duration-300'
              >
                社員一覧トップ
              </Link>
            </li>
            <li>
              <Link
                href='/'
                className='block text-lg text-white hover:text-white hover:underline transition-colors duration-300'
              >
                ホーム
              </Link>
            </li>
          </ul>
        </nav>
        <LogoutButton />
      </aside>

      <main className='flex-1 p-8 bg-gray-100'>
        <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-300'>
          <h2 className='text-3xl font-bold mb-4 text-[#003366]'>{employeeData[0].name}の日報</h2>
          <div className='mb-6'>
            <h3 className='text-2xl font-semibold mb-2 text-[#003366]'>社員情報</h3>
            <p className='text-[#333333]'>
              <strong>部署:</strong> {employeeData[0].department}
            </p>
            <p className='text-[#333333]'>
              <strong>プロジェクト:</strong> {employeeData[0].project}
            </p>
            <p className='text-[#333333]'>
              <strong>役職:</strong> {employeeData[0].role}
            </p>
          </div>
          <div>
            <h3 className='text-2xl font-semibold mb-2 text-[#003366]'>最新の日報</h3>
            <p className='text-lg text-[#333333] whitespace-pre-wrap'>{employeeData[1].text}</p>
            <p className='text-sm text-gray-500 mt-2'>
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
            <div className='mt-4 flex flex-wrap items-center '>
              <Link
                href={`/employee-list/summaried_report/${slack_user_id}`}
                className='bg-[#66B2FF] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 inline-block mr-2 mb-2'
              >
                日報サマリーを見る
              </Link>
              <LinkOneOnOne slackUserId={slack_user_id} className='mr-2 mb-2' />
              <LinkCareerQuestion slackUserId={slack_user_id} className='mr-2 mb-2' />
              <div className='mr-2 mb-2'>
                <BackEmployee />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
