// 1on1アドバイスを見るに遷移
// components/employeelist/LinkCareerQuestion.tsx
'use client';

import { useRouter } from 'next/navigation';

interface LinkOneOnOneProps {
  slackUserId: string;
  className?: string;
}

export default function LinkOneOnOne({ slackUserId, className }: LinkOneOnOneProps) {
  const router = useRouter();

  const handleOneOnOneAdvice = () => {
    try {
      router.push(`/employee-list/OneOnOneAdvice/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('Error navigating to career survey results:', error);
    }
  };

  return (
    <button
      onClick={handleOneOnOneAdvice}
      className={`bg-[#66B2FF] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 inline-block ${className}`}
    >
      1on1 アドバイスを見る
    </button>
  );
}
