// LLMにアドバイスを出力させる

'use client';

import { useEffect, useState } from 'react';

interface UseAdviceDataResult {
  adviceData: string | null;
  loading: boolean;
  error: string | null;
}

export default function useOneOnOneAdvice(
  slack_user_id: string | null,
  start_date: string | null,
  end_date: string | null,
): UseAdviceDataResult {
  const [adviceData, setAdviceData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdviceData() {
      setLoading(true);
      setError(null); // Reset error state before fetch
      try {
        if (!start_date || !end_date) {
          throw new Error('Start date and end date must be provided');
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/client/print_advices/${slack_user_id}/?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch advice data: ${response.status}`);
        }
        const data: string = await response.json();
        setAdviceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (slack_user_id && start_date && end_date) {
      fetchAdviceData();
    }
  }, [slack_user_id, start_date, end_date]);

  return { adviceData, loading, error };
}
