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
      className={`bg-[#66B2FF] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 inline-block ${className}`}
    >
      キャリアアンケート結果を見る
    </button>
  );
}
