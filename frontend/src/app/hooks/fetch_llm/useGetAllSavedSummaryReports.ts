// データベースに保存された '特定ユーザーの全ての日報サマリーデータ' を取得する
// あとはエンドポイントと型定義を完成させる

'use client';

import { useEffect, useState } from 'react';

interface SavedSummaryReport {
  id: number;
  employee_id: string;
  summary: string;
  created_at: Date;
}

type SavedSummaryReports = SavedSummaryReport[];

export const useGetAllSavedSummaryReports = (employeeId: string) => {
  const [SavedSummaryReports, setSavedSummaryReports] = useState<SavedSummaryReports>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllSavedSummaryReports = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/client/print_all_summary_report/${employeeId}/`,
        );

        // 200以外はthrow->catch
        if (!response.ok) {
          throw new Error(
            `Failed to fetch all saved summary reports.: ${response.status} ${response.statusText}`,
          );
        }

        // 読める形に変換
        const allSavedSummaryReports = await response.json();
        console.log(`取得したサマリーデータ: ${allSavedSummaryReports}`);

        // エラーの場合
        if (allSavedSummaryReports.error) {
          throw new Error(allSavedSummaryReports.error);
        }

        // 正常時、レスポンスデータを'SavedSummaryReports'にセットする
        setSavedSummaryReports(allSavedSummaryReports);
      } catch (err) {
        console.error('Error fetching all saved summary reports. :', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchAllSavedSummaryReports();
  }, []);

  return { SavedSummaryReports, loading, error };
};
