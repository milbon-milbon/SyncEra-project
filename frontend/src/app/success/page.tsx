// frontend/src/app/success/page.tsx
'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SuccessPage: React.FC = () => {
    const router =useRouter();

    useEffect(() => {
        // 3秒後にTOPページへリダイレクト
        const timer = setTimeout(() => {
          router.push('/');
        }, 3000);
    
        // クリーンアップタイマー
        return () => clearTimeout(timer);
      }, [router]);
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">新規登録とお支払いが完了しました！</h1>
      <p className="text-lg">ご利用ありがとうございます。</p>
      <p>今後ともSyncEraをよろしくお願いいたします。</p>
    </div>
  );
};

export default SuccessPage;
