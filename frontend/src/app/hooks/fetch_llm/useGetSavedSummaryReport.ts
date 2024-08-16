// データベースに保存された'特定ユーザーの特定の日報サマリーデータ'を取得する: created_atを指定して取得するのが良さそう

'use client';

import { useEffect, useState } from 'react';

interface SavedSummaryReport {
  id: number;
  employee_is: string;
  summary: string;
  created_at: Date;
}

export const useGetSavedSummaryReport = (employeeId: string, createdAt: Date) => {
  const [savedSummaryReport, setSavedSummaryReport] = useState<SavedSummaryReport>(); //初期値何がいいか？？
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSavedSummaryReport = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/client/print_saved_summary_report/${employeeId}/?created_at=${createdAt}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch saved summary report: ${response.status} ${response.statusText}`,
          );
        }
        const savedSummaryReport = await response.json();
        console.log(`取得したサマリーレポート: ${savedSummaryReport}`);

        if (savedSummaryReport.error) {
          throw new Error(savedSummaryReport.error);
        }
        setSavedSummaryReport(savedSummaryReport);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSummaryReport();
  }, []);

  return { savedSummaryReport, loading, error };
};
