//特定のリンク先を指定せずに直前の場所に戻るボタン
// components/employeelist/BackSummary.tsx
// components/BackJustBefore.tsx
'use client';

import { useRouter } from 'next/navigation';

interface BackJustBeforeProps {
  className?: string;
}

export default function BackJustBefore({ className = '' }: BackJustBeforeProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className={`bg-gray-300   hover:bg-[#c0c0c0] text-[#003366] py-2 px-4 rounded-lg ml-2 text-[17px] ${className}`}
    >
      戻る
    </button>
  );
}
