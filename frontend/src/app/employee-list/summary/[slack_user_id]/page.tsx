'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackJustBefore from '@/components/employeelist/BackJustBefore';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import LinkOneOnOne from '@/components/employeelist/LinkOneOnOne';
import LinkCareerQuestion from '@/components/employeelist/LinkCareerQuestion';
import Loading from '@/components/loading';
import Breadcrumb from '@/components/employeelist/Breadcrumb';
import AuthRoute from '@/components/auth/AuthRoute';
import HomeLink from '@/components/employeelist/HomeLink';
import EmployeeLink from '@/components/employeelist/EmployeeLink';
import LogoWhite from '@/components/employeelist/LogoWhite';
import ReactMarkdown from 'react-markdown';
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
    <AuthRoute requiredRole='manager'>
      <div className='min-h-screen flex'>
        <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
          <LogoWhite />
          <nav className='flex-1'>
            <ul className='space-y-6  mt-5'>
              <EmployeeLink />
              <HomeLink />
            </ul>
          </nav>
          <LogoutButton />
        </aside>

        <main className='flex-1 p-8 bg-gray-100'>
          <div>
            <div className='mb-8'>
              <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0'>
                <div className='flex items-center flex-wrap'>
                  <Breadcrumb currentPage='' />
                  <h1 className='text-2xl lg:text-3xl font-bold text-[#003366] mr-4'>
                    {employeeData[0].name}の日報
                  </h1>{' '}
                </div>
                <div className='flex flex-wrap items-center '>
                  <Link
                    href={`/employee-list/summaried_report/${slack_user_id}`}
                    className='bg-[#66B2FF] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 inline-flex items-center mr-2' // inline-flex and items-center added
                  >
                    <img src='/employee-list/summarize.png' alt='Icon' className='w-7 h-7 mr-1' />
                    日報サマリーを見る
                  </Link>{' '}
                  <div className='mr-2'>
                    <LinkOneOnOne slackUserId={slack_user_id} />
                  </div>
                  <LinkCareerQuestion slackUserId={slack_user_id} /> <BackJustBefore />
                </div>
              </div>{' '}
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-300'>
              <div className='mb-6'>
                <h3 className='text-2xl font-semibold mb-2 text-[#003366]'>社員情報</h3>
                <div className='flex'>
                  <div className='w-32 text-[#333333] text-lg'>
                    <div>部署</div>{' '}
                  </div>{' '}
                  <div className='text-[#333333] text-lg'>
                    {': '}
                    {employeeData[0].department}
                  </div>
                </div>
                <div className='flex'>
                  <div className='w-32 text-[#333333] text-lg'>
                    <div>プロジェクト</div>
                  </div>
                  <div className='text-[#333333] text-lg'>
                    {' '}
                    {': '}
                    {employeeData[0].project}
                  </div>
                </div>
                <div className='flex'>
                  <div className='w-32 text-[#333333] text-lg'>
                    <div>役職</div>
                  </div>
                  <div className='text-[#333333] text-lg'>
                    {' '}
                    {': '}
                    {employeeData[0].role}
                  </div>
                </div>
              </div>
              <div>
                <h3 className='text-2xl font-semibold mb-2 text-[#003366]'>最新の日報</h3>
                <ReactMarkdown className='text-[17px] text-[#333333] whitespace-pre-wrap'>
                  {employeeData[1].text}
                </ReactMarkdown>
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
              </div>
            </div>{' '}
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
