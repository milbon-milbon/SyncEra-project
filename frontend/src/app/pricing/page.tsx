// frontend/src/app/pricing/page.tsx変更前===支払方法選択画面===
'use client';

import React, { useState } from 'react';
import PriceList from '@/components/payment/PriceList';
import LogoRblue from '@/components/payment/LogoRblue';
import { useRouter } from 'next/navigation';
import clientLogger from '@/lib/clientLogger';
import Loading from '../components/loading'; // Loadingコンポーネントをインポート

export default function PricingPage() {
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  const router = useRouter();
  const handlePriceSelect = async (priceId: string) => {
    setLoading(true); // ローディング開始

    clientLogger.debug(`選択した支払い方法: ${priceId}`);
    const userInfo = JSON.parse(sessionStorage.getItem('userSignupInfo') || '{}');
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          ...userInfo,
        }),
      });

      const { url } = await response.json();
      if (!url) {
        throw new Error('Unexpected response format');
      }
      router.push(url);
    } catch (error) {
      if (error instanceof Error) {
        clientLogger.error('チェックアウトセッションの作成に失敗しました:${error.message}');
        // エラー処理をここに追加
        if (error.message === 'Unexpected response format') {
          alert('サーバーからの応答が予期しない形式です。サポートにお問い合わせください。');
        } else {
          alert('エラーが発生しました。再試行してください。');
        }
      }
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  if (loading) {
    return <Loading />; // ローディング中はLoadingコンポーネントを表示
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow flex flex-col items-center justify-center bg-[#003366]'>
        <LogoRblue />
        <h1 className='text-2xl mb-8 text-white'>お支払いプランを選択</h1>
        <PriceList onPriceSelect={handlePriceSelect} />
      </div>
    </div>
  );
}
