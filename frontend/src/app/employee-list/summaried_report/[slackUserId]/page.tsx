'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetAllSavedSummaryReports } from '../../../hooks/fetch_llm/useGetAllSavedSummaryReports';
import { useSaveSummaryReport } from '../../../hooks/fetch_llm/useSaveSummaryReport';
import useSummaryData from '../../../hooks/useSummaryData';

// 型定義が必要な場合はここに書く
interface Summary {
  id: number;
  summary: string;
  created_at: Date;
}

export default function SummaryPage() { 
  // URLパラメータからslackUserIdを取得
  const { slackUserId } = useParams()as { slackUserId: string }; //単一の文字列型データであることを明示する
  
  console.log(`slackUserId: ${slackUserId}`);

  // 開始日と終了日を管理する状態
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  // 保存されたサマリーの取得に使用
  const { SavedSummaryReports: savedSummaries, loading: reportsLoading, error: reportsError } = useGetAllSavedSummaryReports(slackUserId);

  // サマリー生成用
  const { summaryData, loading: summaryLoading, error: summaryError } = useSummaryData(slackUserId, startDate, endDate);

  // サマリー選択時に詳細を表示
  const handleSelectSummary = (summary: Summary) => {
    setSelectedSummary(summary);
    if(selectedSummary !== null){
      console.log(`selectedSummary: ${selectedSummary.summary}`)
    }
    
  };

  // サマリー生成ボタンを押した時の処理
  const handleGenerateSummary = async () => {
    console.log('生成するボタンが押されました')
    if (!startDate || !endDate) {
        alert('開始日と終了日を選択してください');
        return;
    }
    console.log(`開始日: ${startDate}`)
    console.log(`終了日: ${endDate}`)
    console.log(`生成されたさまりー: ${summaryData}`) //最初のクリックでは null、でもちょっと時間おいてクリックしたりするとすんなり出ることも、LLM出力のタイムラグが関係していそう。

    if(summaryData !== null){
      // 生成されたサマリーをセット
      setGeneratedSummary(summaryData); //型 'String' の引数を型 'SetStateAction<string | null>' のパラメーターに割り当てることはできません。
      console.log(`generatedSummary: ${generatedSummary}`)
    }
  };

  // サマリー保存ボタンを押した時の処理: ここはまだ調整できず。ボタン押すと422エラーが返ってくる状態
  const handleSaveSummary = async () => {
    if (generatedSummary) {
      await useSaveSummaryReport(slackUserId, generatedSummary);
      alert('サマリーが保存されました');
      setGeneratedSummary(null); // 保存後、生成されたサマリーをリセット
    } else {
      alert('サマリーが生成されていません');
    }
  };

  return (
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
                <p className="text-red-500">保存されたサマリーの読み込みエラー: {reportsError.message}</p>
              ) : (
                <ul className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {savedSummaries.length > 0 ? (
                    savedSummaries.map((summary) => (
                      <li key={summary.id} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {new Date(summary.created_at).toLocaleDateString()}
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
                  選択されたサマリー: {new Date(selectedSummary.created_at).toISOString().split('T')[0]}
                </h3>
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <p className="text-lg">
                    {summaryError
                        ? `エラー: ${summaryError.message}`
                        : selectedSummary.summary}
                  </p>
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
              {generatedSummary && (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-[#003366] mb-2">
                      生成されたサマリー:
                    </h3>
                    <div className="bg-gray-100 p-4 rounded mb-4">
                      <p className="text-lg">{generatedSummary}</p>
                    </div>
                    <button
                      onClick={handleSaveSummary}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 transition-colors duration-300"
                    >
                      サマリーを保存
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
