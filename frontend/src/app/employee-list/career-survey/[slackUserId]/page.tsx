// // Loading画面をいれたい

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGetAllSavedCareerSurveyResults}from '../../../hooks/fetch_llm/useGetAllSavedCareerSurveyResults'
import ReactMarkdown from 'react-markdown';

// hooksより引用
interface CareerSurveyResult {
  id: number
  slack_user_id: string;
  result: string;
  created_at: string; // ISO 8601 形式の日時: 'created_at': datetime.datetime(2024, 8, 14, 21, 27, 19, 631790)
}

export default function CareerSurvey({ params }: { params: { slackUserId: string } }) {

  const { allSavedCareerSurveyResults, loading, error } = useGetAllSavedCareerSurveyResults(params.slackUserId);
  const [selectedSurvey, setSelectedSurvey] = useState<CareerSurveyResult | null>(null);

  const handleViewDetails = (survey: CareerSurveyResult) => {
    setSelectedSurvey(survey);
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>エラーが発生しました: {error.message}</p>;
  }

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
            {allSavedCareerSurveyResults.map((survey) => (
                <li key={survey.id} className="flex justify-between items-center">
                  <span className="text-[#333333]">{new Date(survey.created_at).toLocaleString()}</span>
                  <button
                    onClick={() => handleViewDetails(survey)}
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
                  回答日時: {new Date(selectedSurvey.created_at).toLocaleString()}
                </h2>
                {/* ReactMarkdownを使用して、selectedSurvey.resultをMarkdown形式で表示 */}
                <ReactMarkdown className="text-lg text-[#333333]">
                  {selectedSurvey.result}
                </ReactMarkdown>
                {/* <p className="text-lg text-[#333333]">
                  {selectedSurvey.result}
                </p> */}
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
