// hooks/useOneOnOneAdvice.ts

import { useState } from 'react';

export default function useOneOnOneAdvice() {
  const [adviceData, setAdviceData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async (slackUserId: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);

    try {
      // モックデータを設定
      setAdviceData(
        `ここにアドバイスが表示されます。ユーザーID: ${slackUserId}, 開始日: ${startDate}, 終了日: ${endDate}`,
      );
    } catch (err) {
      setError('アドバイスの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return { adviceData, loading, error, fetchAdvice };
}
