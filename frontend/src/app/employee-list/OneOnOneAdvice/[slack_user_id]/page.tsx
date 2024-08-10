'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OneOnOneAdvicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slack_user_id = params.slack_user_id as string;
  const start_date = searchParams.get('start_date') || '';
  const end_date = searchParams.get('end_date') || '';

  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slack_user_id && start_date && end_date) {
      const fetchAdvice = async () => {
        try {
          const response = await fetch(
            `/api/client/print_advices/${slack_user_id}/?start_date=${start_date}&end_date=${end_date}`,
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Failed to fetch advice: ${response.status} ${response.statusText}\n${errorText}`,
            );
          }
          const data = await response.json();
          setAdvice(JSON.stringify(data, null, 2));
        } catch (err) {
          console.error('Error fetching advice:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAdvice();
    }
  }, [slack_user_id, start_date, end_date]);

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
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">1on1 アドバイス</h2>
            <p>Slack User ID: {slack_user_id}</p>
            <p>Start Date: {start_date}</p>
            <p>End Date: {end_date}</p>
            {advice ? (
              <pre className="text-lg whitespace-pre-wrap mt-4">{advice}</pre>
            ) : (
              <div className="text-lg text-gray-600 mt-4">No advice available.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
