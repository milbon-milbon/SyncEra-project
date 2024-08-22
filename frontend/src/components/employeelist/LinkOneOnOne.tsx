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
      className='bg-[#66b2ff] text-white text-[17px] px-4 py-2 rounded-lg font-bold  hover:bg-[#003366] transition-colors duration-300 flex items-center justify-center' // justify-center added
    >
      <img src='/employee-list/person_edit.png' alt='Icon' className='w-7 h-7 mr-2' />
      1on1 アドバイスを見る
    </button>
  );
}
