//キャリアアンケート分析結果を見るへ遷移(キャリアサーベイに配置)
// components/employeelist/LinkCareerQuestionSurvey.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';

interface LinkCareerQuestionSurveyProps {
  slackUserId: string;
  className?: string;
}

export default function LinkCareerQuestionSurvey({
  slackUserId,
  className,
}: LinkCareerQuestionSurveyProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCareerSurveyAction = () => {
    try {
      if (pathname.includes('/career-survey')) {
        // 新しいキャリアアンケートを作成するページへ遷移
        router.push(`/employee-list/create-career-survey/${encodeURIComponent(slackUserId)}`);
      } else {
        // キャリアアンケート結果ページへ遷移
        router.push(`/employee-list/career-survey/${encodeURIComponent(slackUserId)}`);
      }
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  const buttonText = pathname.includes('/career-survey')
    ? '新しいキャリアアンケートを作成'
    : 'キャリアアンケート結果を見る';

  return (
    <button
      onClick={handleCareerSurveyAction}
      className={`bg-[#66B2FF] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 inline-block ${className}`}
    >
      {buttonText}
    </button>
  );
}
