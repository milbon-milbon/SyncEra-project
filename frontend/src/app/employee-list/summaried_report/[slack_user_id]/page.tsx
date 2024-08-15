'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SummaryPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [savedSummaries, setSavedSummaries] = useState([
    { id: 1, startDate: '2024-08-01', endDate: '2024-08-07', content: 'サマリー内容1' },
    { id: 2, startDate: '2024-08-08', endDate: '2024-08-14', content: 'サマリー内容2' },
    { id: 3, startDate: '2024-08-15', endDate: '2024-08-21', content: 'サマリー内容3' },
  ]);

  const handleGenerateSummary = () => {
    setGeneratedSummary('生成されたサマリーの内容がここに表示されます。');
  };

  const handleSaveSummary = () => {
    if (!generatedSummary || !startDate || !endDate) return;

    const newSummary = {
      id: Date.now(),
      startDate,
      endDate,
      content: generatedSummary,
    };

    setSavedSummaries((prev) => [...prev, newSummary]);
    setGeneratedSummary('');
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteSummary = (id) => {
    const updatedSummaries = savedSummaries.filter((summary) => summary.id !== id);
    setSavedSummaries(updatedSummaries);
    if (selectedSummary && selectedSummary.id === id) {
      setSelectedSummary(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
          <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-16 mb-8" />
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
                  href="/employee-list/summary/${slackUserId}"
                  className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
                >
                  日報へ戻る
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
            className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto text-center"
          >
            ログアウト
          </Link>
        </aside>

        <main className="flex-1 p-8 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
            <h1 className="text-3xl font-bold mb-8 text-[#003366]">日報サマリー</h1>

            <div className="flex gap-4">
              {/* 左側: 保存履歴一覧 */}
              <div className="w-1/2 pr-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h2 className="text-2xl font-semibold text-[#003366] mb-4">保存履歴一覧</h2>
                  <ul className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {savedSummaries.map((summary) => (
                      <li key={summary.id} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{`${summary.startDate} ~ ${summary.endDate}`}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                setSelectedSummary(
                                  selectedSummary?.id === summary.id ? null : summary,
                                )
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-300"
                            >
                              詳細を見る
                            </button>
                            <button
                              onClick={() => handleDeleteSummary(summary.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedSummary && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-[#003366] mb-4">
                      選択されたサマリー: {selectedSummary.startDate} ~ {selectedSummary.endDate}
                    </h3>
                    <div className="bg-gray-100 p-4 rounded mb-4">
                      <p className="text-lg">{selectedSummary.content}</p>
                    </div>
                    <button
                      onClick={() => setSelectedSummary(null)}
                      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
                    >
                      閉じる
                    </button>
                  </div>
                )}
              </div>

              {/* 右側: 新規日報サマリー */}
              <div className="w-1/2 pl-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold text-[#003366] mb-4">新規日報サマリー</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border rounded border-[#66b2ff] focus:ring focus:ring-[#66b2ff] focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border rounded border-[#66b2ff] focus:ring focus:ring-[#66b2ff] focus:ring-opacity-50"
                    />
                  </div>
                  <button
                    onClick={handleGenerateSummary}
                    className="w-full bg-[#003366] text-white px-6 py-2 rounded hover:bg-[#002244] transition-colors duration-300 mb-4"
                  >
                    サマリー出力
                  </button>
                  {generatedSummary && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-[#003366] mb-2">
                        生成されたサマリー
                      </h3>
                      <div className="bg-gray-100 p-4 rounded mb-4">
                        <p className="text-lg">{generatedSummary}</p>
                      </div>
                      <button
                        onClick={handleSaveSummary}
                        className="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors duration-300"
                      >
                        保存
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
