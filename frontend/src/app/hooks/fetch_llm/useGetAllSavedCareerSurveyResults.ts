// データベースに保存された '特定ユーザーの全てのキャリアアンケート結果' を取得する

'use client';

import { useEffect, useState } from 'react';

interface CareerSurveyResult {
    // 型定義が必要なら定義する
    // アンケートロジックが出来上がってからの実装
}

type CareerSurveyResults = CareerSurveyResult[]

export const useGetAllSavedCareerSurveyResults = (employeeId: string) => {
    const [allSavedCareerSurveyResults, setALlSavedCareerSurveyResult] = useState<CareerSurveyResults>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchALlSavedCareerSurveyResults = async () => {
        try {
        const response = await fetch(`http://localhost:8000/client/print_all_career_surveyresults/${employeeId}/`);

        if (!response.ok) {
            throw new Error(`Failed to fetch all saved career survey results.: ${response.status} ${response.statusText}`);
        }
        const allSavedCareerSurveyResults = await response.json();
        console.log(`取得した全てのアンケート結果: ${allSavedCareerSurveyResults}`)
        
        if (allSavedCareerSurveyResults.error) {
            throw new Error(allSavedCareerSurveyResults.error);
        }
        setALlSavedCareerSurveyResult(allSavedCareerSurveyResults);
        } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
        setLoading(false);
        }
    };

    fetchALlSavedCareerSurveyResults();
    }, []);

    return { allSavedCareerSurveyResults, loading, error };
};
