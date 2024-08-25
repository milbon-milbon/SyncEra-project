//キャリアアンケート分析結果を見るへ遷移
// components/employeelist/LinkCareerQuestion.tsx
'use client';

import { useRouter } from 'next/navigation';

interface LinkCareerQuestionProps {
  slackUserId: string;
  className?: string;
}

export default function LinkCareerQuestion({ slackUserId, className }: LinkCareerQuestionProps) {
  const router = useRouter();

  const handleCareerSurveyResults = () => {
    try {
      router.push(`/employee-list/career-survey/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error('Error navigating to career survey results:', error);
    }
  };

  return (
    <button
      onClick={handleCareerSurveyResults}
      className='bg-[#66b2ff] text-white text-[17px] px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 flex items-center justify-center' // justify-center added
    >
      <img src='/employee-list/feature_search.png' alt='Icon' className='w-7 h-7 mr-2' />
      キャリアアンケート結果を見る
    </button>
  );
}
