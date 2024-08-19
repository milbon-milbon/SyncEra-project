// データベースに保存された '特定ユーザーの全ての1on1アドバイスデータ' を取得する

'use client';

import { useEffect, useState } from 'react';

interface SavedAdvice {
    id: number
    slack_user_id: string
    advices: string
    created_at: Date
}

type SavedAdvices = SavedAdvice[]

export const useGetAllSavedAdvices = (slackUserId: string) => {
    const [allSavedAdvices, setAllSavedAdvices] = useState<SavedAdvices>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
    const fetchAllSavedAdvices = async () => {
        try {
        const response = await fetch(`http://localhost:8000/client/print_all_advices/${slackUserId}/`);

        if (!response.ok) {
            throw new Error(`Failed to fetch all saved advices: ${response.status} ${response.statusText}`);
        }
        
        const allSavedAdvices = await response.json();
        console.log(`取得した全てのアドバイスデータ: ${allSavedAdvices}`)
        
        if (allSavedAdvices.error) {
            throw new Error(allSavedAdvices.error);
        }

        setAllSavedAdvices(allSavedAdvices);

        } catch (err) {
        console.error('Error fetching all saved advices:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
        setLoading(false);
        }
    };

    fetchAllSavedAdvices();
    }, []);

    return { allSavedAdvices, loading, error };
};
