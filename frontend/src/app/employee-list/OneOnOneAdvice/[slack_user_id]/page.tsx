'use client';

// pages/employee-list/OneOnOneAdvice/[slack_user_id]/page.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OneOnOneAdvicePage() {
  const router = useRouter();
  const { slack_user_id } = router.query;

  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slack_user_id) {
      // モックデータの設定（実際にはAPIコールなど）
      setTimeout(() => {
        setAdvice(`Sample advice for Slack user ID: ${slack_user_id}`);
        setLoading(false);
      }, 1000);
    }
  }, [slack_user_id]);

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
                <a href="/employee-list" className="hover:underline">
                  社員一覧
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  ホームページへ戻る
                </a>
              </li>
            </ul>
          </nav>
          <a
            href="/login"
            className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto inline-block text-center"
          >
            ログアウト
          </a>
        </aside>

        <main className="flex-1 p-8 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">1on1 アドバイス</h2>
            {advice ? (
              <div className="text-lg whitespace-pre-wrap">{advice}</div>
            ) : (
              <div className="text-lg text-gray-600">No advice available.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
