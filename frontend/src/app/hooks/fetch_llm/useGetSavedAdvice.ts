// データベースに保存された'特定ユーザーの特定の1on1アドバイスデータ'を取得する: created_atを指定して取得するのが良さそう

'use client';

import { useEffect, useState } from 'react';

interface SavedAdvice {
    id: number
    employee_id: string
    advices: string
    created_st: Date
}

export const useGetSavedAdvice = (employeeId: string, createdAt: Date) => {
    const [savedAdvice, setSavedAdvice] = useState<SavedAdvice>(); //初期値何がいいか？？
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchSavedAdvice = async () => {
        try {
        const response = await fetch(`http://localhost:8000/client/print_saved_advice/${employeeId}/?created_at=${createdAt}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch saved advice: ${response.status} ${response.statusText}`);
        }
        const savedAdvice = await response.json();
        console.log(`取得したアドバイスデータ: ${savedAdvice}`)
        
        if (savedAdvice.error) {
            throw new Error(savedAdvice.error);
        }
        setSavedAdvice(savedAdvice);
        console.log(`取得したアドバイスデータ: ${savedAdvice}`)

        } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
        setLoading(false);
        }
    };

    fetchSavedAdvice();
    }, []);

    return { savedAdvice, loading, error };
};
