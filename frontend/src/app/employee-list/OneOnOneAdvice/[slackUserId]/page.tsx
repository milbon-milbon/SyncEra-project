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
import BackEmployee from '@/components/employeelist/BackEmployee';
import LinkCareerQuestion from '@/components/employeelist/LinkCareerQuestion';
import LinkSummaryReport from '@/components/employeelist/LinkSummariedReport';
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
        <div className='bg-white p-6 rounded-lg shadow-xl border border-gray-300'>
          <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
            <h2 className='text-3xl font-bold text-[#003366] mb-4 sm:mb-0'>1on1アドバイス生成</h2>
            <div className='flex flex-wrap justify-center sm:justify-end space-x-2'>
              <LinkSummaryReport slackUserId={slackUserId} />
              <LinkCareerQuestion slackUserId={slackUserId} />
              <BackEmployee />
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='border rounded-lg p-4 shadow' style={{ backgroundColor: '#E0ECF8' }}>
              <h3 className='text-2xl font-semibold mb-4 text-[#003366]'>新しく生成する</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-2 text-sm font-medium'>開始日:</label>
                  <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium'>終了日:</label>
                  <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='w-full p-2 border rounded'
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateAdvice}
                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-colors duration-300'
                // disabled={generatingAdvice}
              >
                アドバイス生成
              </button>
              {loading ? (
                <p className='mt-4 text-blue-600 font-medium'>アドバイスを生成中です...</p>
              ) : newAdvice ? (
                <div className='mt-6'>
                  <h4 className='text-xl font-semibold mb-2'>生成されたアドバイス:</h4>
                  <ReactMarkdown className='whitespace-pre-wrap bg-white p-4 rounded'>
                    {newAdvice}
                  </ReactMarkdown>
                  <button
                    onClick={handleSaveAdvice}
                    className='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors duration-300'
                  >
                    アドバイスを保存
                  </button>
                </div>
              ) : null}
            </div>

            <div className='border rounded-lg p-4 shadow' style={{ backgroundColor: '#E0ECF8' }}>
              <h3 className='text-2xl font-semibold mb-4 text-[#003366]'>保存済み一覧</h3>
              {allSavedAdvices.length > 0 ? (
                <ul className='space-y-4'>
                  {allSavedAdvices.map((advice: Advice) => (
                    <li
                      key={advice.id}
                      className='border p-4 rounded-lg shadow flex justify-between items-center bg-white hover:bg-gray-100 transition-colors duration-300'
                      onClick={() => handleSelectAdvice(advice)}
                    >
                      <span>生成日 : {new Date(advice.created_at).toLocaleDateString()}</span>
                      <button className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300'>
                        詳細を見る
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>保存済みのアドバイスがありません。</p>
              )}
              {selectedAdvice && (
                <div className='mt-6 bg-white p-4 rounded-lg shadow'>
                  <h4 className='text-xl font-semibold mb-2'>選択されたアドバイス</h4>
                  <ReactMarkdown className='text-sm text-gray-600 mb-2'>
                    {selectedAdvice.advices}
                  </ReactMarkdown>
                  <button
                    onClick={() => setSelectedAdvice(null)}
                    className='mt-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300'
                  >
                    閉じる
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
