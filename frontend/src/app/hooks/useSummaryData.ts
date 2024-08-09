import { useEffect, useState } from 'react';

export default function useSummaryData(
  slack_user_id: string,
  start_date: string | null,
  end_date: string | null,
) {
  const [summaryData, setSummaryData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummaryData() {
      setLoading(true);
      setError(null); // Reset error state before fetch
      try {
        if (!start_date || !end_date) {
          throw new Error('Start date and end date must be provided');
        }
        const response = await fetch(
          `http://localhost:8000/client/print_summary/${slack_user_id}/?start_date=${encodeURIComponent(
            start_date,
          )}&end_date=${encodeURIComponent(end_date)}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch summary data: ${response.status}`);
        }
        const data = await response.json();
        setSummaryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (slack_user_id && start_date && end_date) {
      fetchSummaryData();
    }
  }, [slack_user_id, start_date, end_date]);

  return { summaryData, loading, error };
}
