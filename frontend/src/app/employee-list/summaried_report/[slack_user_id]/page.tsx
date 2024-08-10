// 'use client';

// import Link from 'next/link';
// import { useParams, useSearchParams } from 'next/navigation';
// import useSummaryData from '../../../hooks/useSummaryData';

// export default function SummaryPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();

//   const slack_user_id = params.slack_user_id as string;
//   const start_date = searchParams.get('start_date');
//   const end_date = searchParams.get('end_date');

//   // カスタムフックを使用してデータを取得
//   const { summaryData, loading, error } = useSummaryData(slack_user_id, start_date, end_date);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!summaryData) return <div>サマリーデータが見つかりません</div>;

//   console.log(summaryData);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="bg-[#003366] text-white p-4 flex items-center justify-between">
//         <div className="text-4xl font-bold">
//           <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-16" />
//         </div>
//       </header>

//       <div className="flex flex-1">
//         <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
//           <nav className="flex-1">
//             <ul className="space-y-4">
//               <li>
//                 <Link href="/employee-list" className="hover:underline">
//                   社員一覧
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/" className="hover:underline">
//                   ホームページへ戻る
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//           <Link
//             href="/login"
//             className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto inline-block text-center"
//           >
//             ログアウト
//           </Link>
//         </aside>

//         <main className="flex-1 p-8 bg-gray-100">
//           <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
//             <h2 className="text-3xl font-bold mb-4 text-[#003366]">
//               {slack_user_id}の日報サマリー
//             </h2>
//             <div>
//               <h3 className="text-2xl font-semibold mb-2 text-[#003366]">日報一覧</h3>
//               <div> {summaryData} </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSummaryData from '../../../hooks/useSummaryData';

export default function SummaryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slack_user_id = params.slack_user_id as string;
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');

  const [savedSummaries, setSavedSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const { summaryData, loading, error, fetchSummary } = useSummaryData(
    slack_user_id,
    startDate,
    endDate,
  );

  useEffect(() => {
    // Load saved summaries from localStorage or API
    const loadedSummaries = JSON.parse(localStorage.getItem(`summaries_${slack_user_id}`) || '[]');
    setSavedSummaries(loadedSummaries);
  }, [slack_user_id]);

  const handleSaveSummary = () => {
    const newSummary = {
      id: Date.now(),
      startDate,
      endDate,
      content: summaryData,
    };

    const isDuplicate = savedSummaries.some(
      (summary) => summary.startDate === startDate && summary.endDate === endDate,
    );

    if (!isDuplicate) {
      const updatedSummaries = [...savedSummaries, newSummary];
      setSavedSummaries(updatedSummaries);
      localStorage.setItem(`summaries_${slack_user_id}`, JSON.stringify(updatedSummaries));
    } else {
      alert('この期間のサマリーは既に保存されています。');
    }
  };

  const handleDeleteSummary = (id) => {
    const updatedSummaries = savedSummaries.filter((summary) => summary.id !== id);
    setSavedSummaries(updatedSummaries);
    localStorage.setItem(`summaries_${slack_user_id}`, JSON.stringify(updatedSummaries));
    if (selectedSummary && selectedSummary.id === id) {
      setSelectedSummary(null);
    }
  };

  const handleGenerateSummary = () => {
    fetchSummary(startDate, endDate);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#003366] text-white p-4 flex items-center justify-between">
        <div className="text-4xl font-bold">
          <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-16" />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/employee-list"
                  className="block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  社員一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  ホームページへ戻る
                </Link>
              </li>
            </ul>
          </nav>
          <Link
            href="/login"
            className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto inline-block text-center"
          >
            ログアウト
          </Link>
        </aside>

        <main className="flex-1 p-8 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366] mb-6">
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">
              {slack_user_id}の日報サマリー
            </h2>
            <div className="mb-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mr-2 p-2 border rounded"
              />
              <button
                onClick={handleGenerateSummary}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                サマリー出力
              </button>
            </div>
            {summaryData && (
              <>
                <div className="mb-4">{summaryData}</div>
                <button
                  onClick={handleSaveSummary}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  サマリーを保存
                </button>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
            <h3 className="text-2xl font-semibold mb-4 text-[#003366]">保存されたサマリー</h3>
            <ul className="space-y-2">
              {savedSummaries.map((summary) => (
                <li key={summary.id} className="flex justify-between items-center">
                  <span>{`${summary.startDate} ~ ${summary.endDate}`}</span>
                  <div>
                    <button
                      onClick={() => setSelectedSummary(summary)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      詳細
                    </button>
                    <button
                      onClick={() => handleDeleteSummary(summary.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {selectedSummary && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-[#003366]">
              <h3 className="text-2xl font-semibold mb-4 text-[#003366]">
                選択されたサマリー: {selectedSummary.startDate} ~ {selectedSummary.endDate}
              </h3>
              <div>{selectedSummary.content}</div>
              <button
                onClick={() => setSelectedSummary(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                閉じる
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
