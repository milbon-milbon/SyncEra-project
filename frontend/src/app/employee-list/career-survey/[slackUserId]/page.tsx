// // Loading画面をいれたい

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGetAllSavedCareerSurveyResults } from '../../../hooks/fetch_llm/useGetAllSavedCareerSurveyResults';
import ReactMarkdown from 'react-markdown';
import LinkSummariedReport from '@/components/employeelist/LinkSummariedReport';
import LinkOneOnOne from '@/components/employeelist/LinkOneOnOne';
import BackJustBefore from '@/components/employeelist/BackJustBefore';
import Loading from '@/components/loading';
import EmployeeName from '@/components/employeelist/EmployeeName';
import Breadcrumb from '@/components/employeelist/Breadcrumb';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import AuthRoute from '@/components/auth/AuthRoute';
import HomeLink from '@/components/employeelist/HomeLink';
import EmployeeLink from '@/components/employeelist/EmployeeLink';
import NewEmployeeLink from '@/components/employeelist/NewEmployeeLink';
// hooksより引用
interface CareerSurveyResult {
  id: number;
  slack_user_id: string;
  result: string;
  created_at: string; // ISO 8601 形式の日時: 'created_at': datetime.datetime(2024, 8, 14, 21, 27, 19, 631790)
}

export default function CareerSurvey({ params }: { params: { slackUserId: string } }) {
  const slackUserId = params.slackUserId; // この行を追加
  const { allSavedCareerSurveyResults, loading, error } =
    useGetAllSavedCareerSurveyResults(slackUserId);
  const [selectedSurvey, setSelectedSurvey] = useState<CareerSurveyResult | null>(null);

  const handleViewDetails = (survey: CareerSurveyResult) => {
    setSelectedSurvey(survey);
  };

  const handleCloseDetails = () => {
    setSelectedSurvey(null);
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>エラーが発生しました: {error.message}</p>;
  }

  return (
    <AuthRoute requiredRole='manager'>
      <div className='min-h-screen flex bg-white'>
        <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
          <img src='/image/SyncEra(blue_white).png' alt='SyncEra Logo' className='h-16 mb-8' />

          <nav className='flex-1'>
            <ul className='space-y-6'>
              <EmployeeLink />
              <NewEmployeeLink />
              <HomeLink />
            </ul>
          </nav>
          <LogoutButton />
        </aside>

        {/* メインコンテンツ */}
        <main className='flex-1 p-8 bg-gray-100'>
          <div>
            <div className='mb-8'>
              <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0'>
                <div className='flex items-center flex-wrap text-[17px]'>
                  <Breadcrumb currentPage='' />
                  <EmployeeName slackUserId={slackUserId} />
                  <span className=' text-gray-600 ml-2 mr-2'>{' 〉'}</span>
                  <h1 className='text-3xl font-bold text-[#003366] '>
                    キャリアアンケート結果
                  </h1>{' '}
                </div>
                <div className='flex flex-wrap justify-center sm:justify-end space-x-2'>
                  <LinkSummariedReport slackUserId={slackUserId} />
                  <LinkOneOnOne slackUserId={slackUserId} />

                  <BackJustBefore />
                </div>
              </div>
            </div>
          </div>
          <div className='flex'>
            {/* アンケート履歴リスト */}
            <div className='w-1/3 p-4 bg-white rounded-lg shadow-md'>
              <h2 className='text-xl font-bold text-[#003366] mb-4'>アンケート回答履歴</h2>
              <ul className='space-y-4'>
                {allSavedCareerSurveyResults.map((survey) => (
                  <li key={survey.id} className='flex justify-between items-center'>
                    <span className='text-[#333333]'>
                      {new Date(survey.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleViewDetails(survey)}
                      className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-[#003366] transition-colors duration-300'
                    >
                      詳細を見る
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* アンケート詳細表示 */}
            <div className='flex-1 ml-8 p-4 bg-white rounded-lg shadow-md'>
              {selectedSurvey ? (
                <>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold text-[#003366]'>
                      回答日時: {new Date(selectedSurvey.created_at).toLocaleString()}
                    </h2>
                    <button
                      onClick={handleCloseDetails}
                      className='bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300'
                    >
                      閉じる
                    </button>{' '}
                  </div>
                  {/* ReactMarkdownを使用して、selectedSurvey.resultをMarkdown形式で表示 */}
                  <ReactMarkdown className='text-lg text-[#333333]'>
                    {selectedSurvey.result}
                  </ReactMarkdown>
                </>
              ) : (
                <p className='text-lg text-[#333333]'>
                  左側のリストからアンケートを選択してください。
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
