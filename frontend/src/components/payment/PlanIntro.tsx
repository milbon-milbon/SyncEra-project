// frontend/src/components/stripe/PlanIntro.tsx
'use client'; 
import React from 'react';
import Link from 'next/link';

const PlanIntro: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-3xl font-bold mb-4">料金について</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">月額</h2>
        <p className="text-lg mb-4">月額料金でフレキシブルにご利用いただけます。</p>
        <h2 className="text-2xl font-semibold mb-2">年払</h2>
        <p className="text-lg mb-4">一度のお支払いで年間利用が可能です。</p>
      </div>
      <Link href="/signup">
        <button className="mt-8 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] focus:outline-none">
          アカウントを作成する
        </button>
      </Link>
      
      <p className="mt-4">
      既に、SyncEraへの登録がお済みの方は
        <Link href="/signup"><span className="text-blue-500 underline ml-1 text">こちらからログイン</span></Link>
      </p>
    </div>
  );
};

export default PlanIntro;