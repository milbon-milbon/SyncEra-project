// frontend/src/app/pricing/page.tsx変更前===支払方法選択画面===
'use client';

import React from 'react';
import PriceList from '@/components/payment/PriceList';
import LogoRblue from '@/components/payment/LogoRblue';
import { useRouter } from 'next/navigation';
import clientLogger from '@/lib/clientLogger';

export default function PricingPage() {
  const router = useRouter();

  const handlePriceSelect = async (priceId: string) => {
    clientLogger.info(`選択した支払い方法: ${priceId}`);
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
    }
  };

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
// frontend/src/app/pricing/page.tsx（変更後：つながらない？）
// 'use client';

// import React from 'react';
// import PriceList from '@/components/payment/PriceList';
// import LogoRblue from '@/components/payment/LogoRblue';
// import { useRouter } from 'next/navigation';
// import clientLogger from '@/lib/clientLogger';

// export default function PricingPage() {
//   const router = useRouter();

//   const handlePriceSelect = async (priceId: string) => {
//     clientLogger.info(`選択した支払いプラン: ${priceId}`);
//     const userInfo = JSON.parse(sessionStorage.getItem('userSignupInfo') || '{}');
//     try {
//       const response = await fetch('/api/create-checkout-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           priceId,
//           ...userInfo,
//         }),
//       });

//       const { sessionId, url } = await response.json();
//       if (!url) {
//         throw new Error('Unexpected response format');
//       }

//       // セッションIDと企業情報を一時的に保存
//       sessionStorage.setItem('stripe_session_id', sessionId);
//       if (!url) {
//         throw new Error('Unexpected response format');
//       }
//       // Stripeの決済ページにリダイレクト
//       router.push(url);
//     } catch (error) {
//       if (error instanceof Error) {
//         clientLogger.error(`チェックアウトセッションの作成に失敗しました: ${error.message}`);
//         // エラー処理を追加
//         if (error.message === 'Unexpected response format') {
//           alert('サーバーからの応答が予期しない形式です。サポートにお問い合わせください。');
//         } else {
//           alert('エラーが発生しました。再試行してください。');
//         }
//       }
//     }
//   };

//   return (
//     <div className='min-h-screen flex flex-col'>
//       <div className='flex-grow flex flex-col items-center justify-center bg-[#003366]'>
//         <LogoRblue />
//         <h1 className='text-2xl mb-8 text-white'>お支払いプランを選択</h1>
//         <PriceList onPriceSelect={handlePriceSelect} />
//       </div>
//     </div>
//   );
// }
