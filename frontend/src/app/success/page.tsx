// frontend/src/app/success/page.tsx===支払後の画面===
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clientLogger from '@/lib/clientLogger';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    clientLogger.info('SuccessPage loaded');
    // 3秒後にTOPページへリダイレクト
    const timer = setTimeout(() => {
      clientLogger.info('TOPページへリダイレクト');
      router.push('/');
    }, 3000);

    // クリーンアップタイマー
    return () => {
      clientLogger.info('クリーンアップタイマー');
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
      <h1 className='text-2xl font-bold mb-4'>新規登録とお支払いが完了しました！</h1>
      <p className='text-lg'>ご利用ありがとうございます。</p>
      <p>今後ともSyncEraをよろしくお願いいたします。</p>
    </div>
  );
}
