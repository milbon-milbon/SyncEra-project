// 出力した1on1アドバイスをデータベースに保存する(POST)

'use client';

import { useEffect, useState } from 'react';

interface CareerSurveyResult {
    // 型定義が必要なら定義する
}

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchEmployees = async () => {
        try {
        const response = await fetch(`http://localhost:8000/client/all_employee/`);

        if (!response.ok) {
            throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        setEmployees(data);
        } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
        setLoading(false);
        }
    };

    fetchEmployees();
    }, []);

    return { employees, loading, error };
};
