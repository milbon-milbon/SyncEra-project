'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGetAllSavedSummaryReports } from '../../../hooks/fetch_llm/useGetAllSavedSummaryReports';
import { useSaveSummaryReport } from '../../../hooks/fetch_llm/useSaveSummaryReport';
import useSummaryData from '../../../hooks/useSummaryData';
import BackJustBefore from '@/components/employeelist/BackJustBefore';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import LinkOneOnOne from '@/components/employeelist/LinkOneOnOne';
import LinkCareerQuestion from '@/components/employeelist/LinkCareerQuestion';
import EmployeeName from '@/components/employeelist/EmployeeName';
import Breadcrumb from '@/components/employeelist/Breadcrumb';
import AuthRoute from '@/components/auth/AuthRoute';
import HomeLink from '@/components/employeelist/HomeLink';
import EmployeeLink from '@/components/employeelist/EmployeeLink';
import LogoWhite from '@/components/employeelist/LogoWhite';
interface Summary {
  id: number;
  summary: string;
  created_at: Date;
}

export default function SummaryPage() {
  const { slackUserId } = useParams() as { slackUserId: string };
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    SavedSummaryReports: savedSummaries,
    loading: reportsLoading,
    error: reportsError,
  } = useGetAllSavedSummaryReports(slackUserId);

  const {
    summaryData,
    loading: summaryLoading,
    error: summaryError,
  } = useSummaryData(slackUserId, startDate, endDate);

  // 詳細を見るボタンを押すと、setSelectedSummaryに選択されたサマリーのオブジェクトがセットされる
  const handleSelectSummary = (summary: Summary) => {
    setSelectedSummary(summary);
  };

  // 生成するボタンを押したら呼ばれる関数
  const handleGenerateSummary = () => {
    if (!startDate || !endDate) {
      alert('開始日と終了日を選択してください');
      return;
    }
    setLoading(true); // サマリー生成中にloadingをtrueに設定
  };

  // サマリー生成の状態管理
  useEffect(() => {
    if (!summaryLoading && loading) {
      // すでにloading状態になっている場合のみ
      if (summaryData) {
        setGeneratedSummary(summaryData);
        setLoading(false); // ロード完了
      } else {
        setLoading(false); // データが取得できなかった場合
      }
    }
  }, [summaryData, summaryLoading, loading]);

  // 保存するボタンを押した時に呼ばれる関数
  const handleSaveSummary = async () => {
    if (generatedSummary) {
      await useSaveSummaryReport(slackUserId, generatedSummary);
      alert('サマリーが保存されました');
      setGeneratedSummary(null);
      window.location.reload(); // ページをリロード
    } else {
      alert('サマリーが生成されていません');
    }
  };

  return (
    <AuthRoute requiredRole='manager'>
      <div className='min-h-screen flex bg-white'>
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

        <main className='flex-1 p-8 bg-gray-100  '>
          <div className='mb-8'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0'>
              <div className='flex items-center flex-wrap text-[17px]'>
                <Breadcrumb currentPage={''} />
                <EmployeeName slackUserId={slackUserId} /> <span>{' の日報'}</span>
                <span className=' text-gray-600 ml-2 mr-2'>{' 〉'}</span>
                <h1 className='text-2xl lg:text-3xl font-bold text-[#003366] mr-4'>日報サマリー</h1>
              </div>
              <div className='flex flex-wrap items-center space-x-2'>
                <LinkOneOnOne slackUserId={slackUserId} />
                <LinkCareerQuestion slackUserId={slackUserId} />
                <BackJustBefore />
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='w-1/2 '>
              <div className='bg-white rounded-lg shadow-md p-6 border border border-gray-100'>
                <h2 className='text-2xl font-semibold text-[#003366] mb-4'>新しいサマリーを生成</h2>
                <div className='mb-4'>
                  <label className='block text-gray-700 font-medium mb-2'>開始日:</label>
                  <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='border rounded px-4 py-2 w-full'
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 font-medium mb-2'>終了日:</label>
                  <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='border rounded px-4 py-2 w-full'
                  />
                </div>
                <div className='flex items-center '>
                  <button
                    onClick={handleGenerateSummary}
                    className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 transition-colors duration-300'
                  >
                    サマリーを生成
                  </button>
                </div>
                {loading ? ( // Loading表示
                  <p className='mt-4 text-blue-600 font-medium'>要約中です...</p>
                ) : generatedSummary ? (
                  <div className='bg-gray-100 p-4 rounded-lg mt-4 relative'>
                    {' '}
                    <button
                      onClick={handleSaveSummary}
                      className='absolute top-4 mr-2 right-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300'
                    >
                      保存する
                    </button>{' '}
                    <div className='pt-12'>
                      {' '}
                      {/* ボタンの高さ分のパディングを上部に追加 */}
                      <ReactMarkdown className='text-[17px] flex-grow' remarkPlugins={[remarkGfm]}>
                        {generatedSummary}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className='w-1/2'>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-100 max-h-96 overflow-y-auto'>
                <h2 className='text-2xl font-semibold text-[#003366] mb-4'>保存履歴一覧</h2>{' '}
                {reportsLoading ? (
                  <p>保存されたサマリーを読み込み中...</p>
                ) : reportsError ? (
                  <p className='text-red-500'>
                    保存されたサマリーの読み込みエラー: {reportsError.message}
                  </p>
                ) : (
                  <ul className='space-y-4'>
                    {savedSummaries.length > 0 ? (
                      savedSummaries.map((summary) => (
                        <li
                          key={summary.id}
                          className='border p-4 rounded-lg shadow flex justify-between items-center bg-white hover:bg-gray-100 transition-colors duration-300'
                        >
                          <span>生成日 : {new Date(summary.created_at).toLocaleDateString()}</span>

                          <button
                            onClick={() => handleSelectSummary(summary)}
                            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-300'
                          >
                            詳細を見る
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>保存されたサマリーが見つかりません。</p>
                    )}
                  </ul>
                )}
              </div>
              {selectedSummary && (
                <div className='bg-white rounded-lg shadow-md p-6 top-0 border border-gray-100 max-h-[80vh] overflow-y-auto'>
                  <div className='sticky top-[-25px] bg-white p-3 z-10 border-b border-gray-200'>
                    <div className='flex justify-between items-center'>
                      <h3 className='text-2xl font-semibold text-[#003366] '>
                        {new Date(selectedSummary.created_at).toISOString().split('T')[0]}
                        に保存されたサマリー
                      </h3>
                      <button
                        onClick={() => setSelectedSummary(null)}
                        className='bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 '
                      >
                        閉じる
                      </button>
                    </div>
                  </div>
                  <div className='bg-gray-100 p-4 rounded mb-4'>
                    <ReactMarkdown className='text-[17px]' remarkPlugins={[remarkGfm]}>
                      {summaryError ? `エラー: ${summaryError}` : selectedSummary.summary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
