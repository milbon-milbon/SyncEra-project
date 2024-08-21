// Loading画面をいれたい

'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGetAllSavedSummaryReports } from '../../../hooks/fetch_llm/useGetAllSavedSummaryReports';
import { useSaveSummaryReport } from '../../../hooks/fetch_llm/useSaveSummaryReport';
import useSummaryData from '../../../hooks/useSummaryData';

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
    <div className="min-h-screen flex bg-white">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-16 mb-8" />
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <a
                href="/employee-list"
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
                社員一覧
              </a>
            </li>
            <li>
              <a
                href={`/employee-list/summary/${slackUserId}`}
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
                日報へ戻る
              </a>
            </li>
            <li>
              <a
                href="/"
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
                ホームページへ戻る
              </a>
            </li>
          </ul>
        </nav>
        <a
          href="/login"
          className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto text-center"
        >
          ログアウト
        </a>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
          <h1 className="text-3xl font-bold mb-8 text-[#003366]">日報サマリー</h1>
          <div className="flex gap-4">
            <div className="w-1/2 pr-4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-2xl font-semibold text-[#003366] mb-4">保存履歴一覧</h2>
                {reportsLoading ? (
                  <p>保存されたサマリーを読み込み中...</p>
                ) : reportsError ? (
                  <p className="text-red-500">
                    保存されたサマリーの読み込みエラー: {reportsError.message}
                  </p>
                ) : (
                  <ul className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {savedSummaries.length > 0 ? (
                      savedSummaries.map((summary) => (
                        <li key={summary.id} className="bg-gray-100 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              生成日 : {new Date(summary.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSelectSummary(summary)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-300"
                              >
                                詳細を見る
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>保存されたサマリーが見つかりません。</p>
                    )}
                  </ul>
                )}
              </div>
              {selectedSummary && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-[#003366] mb-4">
                    選択されたサマリー:{' '}
                    {new Date(selectedSummary.created_at).toISOString().split('T')[0]}
                  </h3>
                  <div className="bg-gray-100 p-4 rounded mb-4">
                    <ReactMarkdown className="text-lg" remarkPlugins={[remarkGfm]}>
                      {summaryError ? `エラー: ${summaryError.message}` : selectedSummary.summary}
                    </ReactMarkdown>
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

            <div className="w-1/2 pl-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-[#003366] mb-4">新しいサマリーを生成</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">開始日:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">終了日:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded px-4 py-2 w-full"
                  />
                </div>

                <button
                  onClick={handleGenerateSummary}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 transition-colors duration-300"
                >
                  サマリーを生成
                </button>
                {loading ? ( // Loading表示
                  <p className="mt-4 text-blue-600 font-medium">要約中です...</p>
                ) : generatedSummary ? (
                  <div className="bg-gray-100 p-4 rounded mt-4">
                    <ReactMarkdown className="text-lg" remarkPlugins={[remarkGfm]}>
                      {generatedSummary}
                    </ReactMarkdown>
                    <button
                      onClick={handleSaveSummary}
                      className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 transition-colors duration-300"
                    >
                      サマリーを保存
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
