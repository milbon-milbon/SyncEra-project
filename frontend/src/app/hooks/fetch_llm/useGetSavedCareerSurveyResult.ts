// データベースに保存された'特定ユーザーの特定のキャリアアンケート結果'を取得する: created_atを指定して取得するのが良さそう

'use client';

import { useEffect, useState } from 'react';

interface CareerSurveyResult {
    // 型定義が必要なら定義する
}

export const useGetCareerSurveyResult = (employeeId: string, createdAt: Date) => {
    const [careerSurveyResult, setCareerSurveyResult] = useState<CareerSurveyResult>(); //初期値何がいいか？？
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchCareerSurveyResult = async () => {
        try {
        const response = await fetch(`http://localhost:8000/client/print_career_survey_result/${employeeId}/?created_at=${createdAt}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch career survey result: ${response.status} ${response.statusText}`);
        }
        const careerSurveyResult = await response.json();
        if (careerSurveyResult.error) {
            throw new Error(careerSurveyResult.error);
        }
        setCareerSurveyResult(careerSurveyResult);
        console.log(`取得したキャリアアンケート結果: ${careerSurveyResult}`)

        } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
        setLoading(false);
        }
    };

    fetchCareerSurveyResult();
    }, []);

    return { careerSurveyResult, loading, error };
};
