'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import useSummaryData from '../../../hooks/useSummaryData';

export default function SummaryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slack_user_id = params.slack_user_id as string;
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  // カスタムフックを使用してデータを取得
  const { summaryData, loading, error } = useSummaryData(slack_user_id, start_date, end_date);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!summaryData) return <div>サマリーデータが見つかりません</div>;

  console.log(summaryData);

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
                <Link href="/employee-list" className="hover:underline">
                  社員一覧
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
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
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">
              {slack_user_id}の日報サマリー
            </h2>
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[#003366]">日報一覧</h3>
              <div> {summaryData} </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
