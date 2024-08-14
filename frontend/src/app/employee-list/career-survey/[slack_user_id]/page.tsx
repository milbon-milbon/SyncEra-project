'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CareerSurvey({ params }: { params: { slack_user_id: string } }) {
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

  const handleViewDetails = (surveyId: string) => {
    setSelectedSurvey(surveyId);
  };

  const surveyHistory = [
    { id: '1', date: '2024-08-01 12:11' },
    { id: '2', date: '2024-07-01 12:45' },
    { id: '3', date: '2024-06-01 13:04' },
    { id: '4', date: '2024-05-07 12:23' },
    { id: '5', date: '2024-04-01 14:07' },
    { id: '6', date: '2024-03-02 12:16' },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* サイドバー */}
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-2xl font-bold mb-8">
          <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-10" />
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
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-[#003366] mb-8">キャリアアンケート結果</h1>
        <div className="flex">
          {/* アンケート履歴リスト */}
          <div className="w-1/3 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#003366] mb-4">アンケート回答履歴</h2>
            <ul className="space-y-4">
              {surveyHistory.map((survey) => (
                <li key={survey.id} className="flex justify-between items-center">
                  <span className="text-[#333333]">{survey.date}</span>
                  <button
                    onClick={() => handleViewDetails(survey.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded font-bold hover:bg-[#003366] transition-colors duration-300"
                  >
                    詳細を見る
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* アンケート詳細表示 */}
          <div className="flex-1 ml-8 p-4 bg-white rounded-lg shadow-md">
            {selectedSurvey ? (
              <>
                <h2 className="text-xl font-bold text-[#003366] mb-4">
                  アンケートID: {selectedSurvey}
                </h2>
                <p className="text-lg text-[#333333]">
                  ここに{selectedSurvey}のアンケートの分析結果が表示されます。
                </p>
              </>
            ) : (
              <p className="text-lg text-[#333333]">
                左側のリストからアンケートを選択してください。
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
