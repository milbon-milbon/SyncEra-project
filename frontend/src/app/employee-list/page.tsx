// Loading画面をいれたい

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEmployees } from '../hooks/useEmployees';
import AuthRoute from '@/components/auth/AuthRoute';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import HomeLink from '@/components/employeelist/HomeLink';
import NewEmployeeLink from '@/components/employeelist/NewEmployeeLink';
import LogoWhite from '@/components/employeelist/LogoWhite';
type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  project: string;
  slack_user_id: string;
  slack_user_info?: {
    id: string;
    image_512: string;
    name: string;
    real_name: string;
  };
};

export default function EmployeeList() {
  const router = useRouter();
  const { employees } = useEmployees();

  const handleViewDetails = (slackUserId: string) => {
    try {
      router.push(`/employee-list/summary/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('error');
    }
  };

  const handleOneOnOneAdvice = (slackUserId: string) => {
    try {
      router.push(`/employee-list/OneOnOneAdvice/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('error');
    }
  };

  const handleCareerSurveyResults = (slackUserId: string) => {
    try {
      router.push(`/employee-list/career-survey/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('error');
    }
  };

  return (
    <AuthRoute requiredRole='manager'>
      <div className='min-h-screen flex bg-white'>
        <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
          <LogoWhite />
          <nav className='flex-1'>
            <ul className='space-y-6  mt-5'>
              <NewEmployeeLink />
              <HomeLink />
            </ul>
          </nav>
          <LogoutButton />
        </aside>

        <main className='flex-1 p-8 bg-gray-100'>
          <h1 className='text-3xl font-bold text-[#003366] mb-8'>社員一覧</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
            {employees.map((employee: Employee) => (
              <div
                key={employee.id}
                className='bg-white p-6 rounded-lg shadow-md flex items-start relative border border-gray-300'
              >
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-[#003366] mb-2'>{employee.name}</h2>
                  <p className='text-[17px] text-[#333333] mb-1'>部署: {employee.department}</p>
                  <p className='text-[17px] text-[#333333] mb-1'>役職: {employee.role}</p>
                  <p className='text-[17px] text-[#333333] mb-4'>担当案件名: {employee.project}</p>
                  <div className='flex flex-col space-y-4 text-[17px]'>
                    <button
                      onClick={() => handleViewDetails(employee.slack_user_id)}
                      className='bg-[#66b2ff] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 flex items-center justify-center' // justify-center added
                    >
                      <img
                        src='/employee-list/event_repeat.png'
                        alt='Icon'
                        className='w-7 h-7 mr-2 '
                      />
                      日報を見る
                    </button>
                    <button
                      onClick={() => handleOneOnOneAdvice(employee.slack_user_id)}
                      className='bg-[#66b2ff] text-white text-[17px] px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 flex items-center justify-center' // justify-center added
                    >
                      <img
                        src='/employee-list/person_edit.png'
                        alt='Icon'
                        className='w-7 h-7 mr-2'
                      />
                      1on1 アドバイスを見る{' '}
                    </button>
                    <button
                      onClick={() => handleCareerSurveyResults(employee.slack_user_id)}
                      className='bg-[#66b2ff] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 flex items-center justify-center' // justify-center added
                    >
                      <img
                        src='/employee-list/feature_search.png'
                        alt='Icon'
                        className='w-7 h-7 mr-2'
                      />
                      キャリアアンケート結果を見る
                    </button>
                  </div>
                </div>
                <div className='w-32 h-32 ml-4 border border-gray-300 rounded-lg overflow-hidden'>
                  {employee.slack_user_info?.image_512 ? (
                    <img
                      src={employee.slack_user_info.image_512}
                      alt={`${employee.slack_user_info.image_512}のSlackアイコン`}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='bg-gray-200 rounded-lg shadow-md w-full h-32 flex items-center justify-center'>
                      画像なし
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
