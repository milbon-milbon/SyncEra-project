// Loading画面をいれたい

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetAllSavedAdvices } from '../../../hooks/fetch_llm/useGetAllSavedAdvice';
import { useSaveAdvice } from '../../../hooks/fetch_llm/useSaveAdvice';
import useOneOnOneAdvice from '../../../hooks/useOneOnOneAdvice';
import ReactMarkdown from 'react-markdown';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import BackJustBefore from '@/components/employeelist/BackJustBefore';
import LinkCareerQuestion from '@/components/employeelist/LinkCareerQuestion';
import LinkSummaryReport from '@/components/employeelist/LinkSummariedReport';
import Breadcrumb from '@/components/employeelist/Breadcrumb';
import EmployeeName from '@/components/employeelist/EmployeeName';
interface Advice {
  id: number;
  advices: string;
  created_at: Date;
}

export default function OneOnOneAdvicePage() {
  // URLパラメータからslackUserIdを取得
  const { slackUserId } = useParams() as { slackUserId: string };

  // ローカルステートの設定
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [newAdvice, setNewAdvice] = useState<string | null>(null);
  const [selectedAdvice, setSelectedAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // hooksからデータと状態を取得
  const {
    allSavedAdvices,
    loading: fetchingAllAdvices,
    error: allAdvicesError,
  } = useGetAllSavedAdvices(slackUserId);
  const {
    adviceData,
    loading: generatingAdvice,
    error: adviceError,
  } = useOneOnOneAdvice(slackUserId, startDate, endDate);

  // 詳細を見るボタンを押したら呼ばれる関数
  const handleSelectAdvice = (advice: Advice) => {
    setSelectedAdvice(advice);
  };

  // 生成するボタンを押した時に呼ばれる関数
  const handleGenerateAdvice = async () => {
    if (!startDate || !endDate) {
      alert('開始日と終了日を選択してください');
      return;
    }
    setLoading(true); // ロード状態に設定
  };

  // アドバイス生成の状態管理
  useEffect(() => {
    if (!generatingAdvice && loading) {
      // すでにloading状態になっている場合のみ
      if (adviceData) {
        setNewAdvice(adviceData);
        setLoading(false); // ロード完了
      } else {
        setLoading(false); // データが取得できなかった場合
      }
    }
  }, [adviceData, generatingAdvice, loading]);

  // 保存するボタンを押した時に呼ばれる関数
  const handleSaveAdvice = async () => {
    if (newAdvice) {
      await useSaveAdvice(slackUserId, newAdvice);
      alert('アドバイスが保存されました');
      setNewAdvice(null);
      window.location.reload(); // ページをリロード
    } else {
      alert('アドバイスが生成されていません');
    }
  };
  return (
    <div className='min-h-screen flex bg-white'>
      <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
        <img src='/image/SyncEra(blue_white).png' alt='SyncEra Logo' className='h-16 mb-8' />
        <nav className='flex-1'>
          <ul className='space-y-4'>
            <li>
              <a
                href='/employee-list'
                className='block text-lg text-white hover:text-white hover:underline transition-colors duration-300'
              >
                社員一覧トップ
              </a>
            </li>
            <li>
              <a
                href='/'
                className='block text-lg text-white hover:text-white hover:underline transition-colors duration-300'
              >
                ホーム
              </a>
            </li>
          </ul>
        </nav>
        <LogoutButton />
      </aside>

      <main className='flex-1 p-8 bg-gray-100  '>
        <div>
          <div className='mb-8'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0'>
              <div className='flex items-center flex-wrap text-[17px]'>
                <Breadcrumb currentPage='' />
                <EmployeeName slackUserId={slackUserId} />
                <span className=' text-gray-600 ml-2 mr-2'>{' 〉'}</span>
                <h1 className='text-2xl lg:text-3xl font-bold text-[#003366] mr-4'>
                  1on1アドバイス生成
                </h1>
              </div>
              <div className='flex flex-wrap items-center space-x-2'>
                <LinkSummaryReport slackUserId={slackUserId} />
                <LinkCareerQuestion slackUserId={slackUserId} />
                <BackJustBefore />
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='w-1/2'>
              <div className='bg-white rounded-lg shadow-md p-6 border border border-gray-100'>
                <h2 className='text-2xl font-semibold text-[#003366] mb-4'>新しく生成する</h2>
                <div className='mb-4'>
                  {/* <div> */}
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
                    onClick={handleGenerateAdvice}
                    className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 transition-colors duration-300'
                  >
                    アドバイス生成
                  </button>{' '}
                </div>
                {loading && (
                  <p className='mt-4 text-blue-600 font-medium'>アドバイスを生成中です...</p>
                )}{' '}
                {/* 生成されたアドバイスはここに表示 */}
                {newAdvice && !loading && (
                  <div className='bg-gray-100 p-4 rounded-lg mt-4 relative'>
                    <button
                      onClick={handleSaveAdvice}
                      className='absolute top-4 mr-2 right-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300'
                    >
                      保存する
                    </button>
                    <div className='pt-12'>
                      <ReactMarkdown className='text-[17px] text bg-gray-100 p-4 rounded-lg'>
                        {newAdvice}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>{' '}
            {/* 保存済み一覧セクション */}
            <div className='w-1/2 '>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-100'>
                <h2 className='text-2xl font-semibold text-[#003366] mb-4'>保存履歴一覧</h2>
                {allSavedAdvices.length > 0 ? (
                  <ul className='space-y-4'>
                    {allSavedAdvices.map((advice: Advice) => (
                      <li
                        key={advice.id}
                        className='border p-4 rounded-lg shadow flex justify-between items-center bg-white hover:bg-gray-100 transition-colors duration-300'
                        onClick={() => handleSelectAdvice(advice)}
                      >
                        <span>生成日 : {new Date(advice.created_at).toLocaleDateString()}</span>
                        <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-300'>
                          詳細を見る
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>保存済みのアドバイスがありません。</p>
                )}
              </div>
              {/* 選択されたアドバイスはここに表示 */}
              {selectedAdvice && (
                <div className='bg-white rounded-lg shadow-md p-6 border border border-gray-100'>
                  <div className='flex justify-between items-center mb-8'>
                    <h3 className='text-2xl font-semibold text-[#003366] '>選択されたアドバイス</h3>
                    <button
                      onClick={() => setSelectedAdvice(null)}
                      className='ml-auto bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300'
                    >
                      閉じる
                    </button>
                  </div>
                  <div className='bg-gray-100 p-4 rounded mb-4'>
                    <ReactMarkdown className='text-[17px] text bg-gray-100 p-4 rounded-lg'>
                      {selectedAdvice.advices}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
