// frontend/src/app/success/page.tsx===支払後の画面===
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clientLogger from '@/lib/clientLogger';
import Loading from '@/components/loading';

export default function SuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    clientLogger.info('SuccessPage loaded');

    // 3秒間ローディング画面を表示
    const loadingTimer = setTimeout(() => {
      setIsLoading(false); // ローディング終了
      clientLogger.info('SuccessPage displayed');
    }, 2000);

    // ローディング終了後、さらに3秒後にTOPページへリダイレクト
    const redirectTimer = setTimeout(() => {
      clientLogger.info('TOPページへリダイレクト');
      router.push('/');
    }, 5000); // ローディング2秒＋表示3秒

    // クリーンアップタイマー
    return () => {
      clientLogger.info('クリーンアップタイマー');
      clearTimeout(loadingTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  if (isLoading) {
    return <Loading />; // ローディング中はLoadingコンポーネントを表示
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white text-[#003366]'>
      <div className='bg-white  p-8'>
        <h1 className='text-3xl font-bold  mb-6'>新規登録とお支払いが完了しました。</h1>
        <img
          src='/payment/paymentcompleted.png'
          alt='Payment is Completed'
          className='max-w-md h-auto mb-6 mx-auto'
        />
        <p className='text-lg  flex flex-col items-center justify-center'>
          ご利用ありがとうございます。
        </p>
        <p className='text-lg  flex flex-col items-center justify-center'>
          今後ともSyncEraをよろしくお願いいたします。
        </p>
      </div>
    </div>
  );
}
