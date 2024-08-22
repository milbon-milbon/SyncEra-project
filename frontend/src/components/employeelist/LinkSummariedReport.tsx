// 日報サマリーをを見るに遷移
// components/employeelist/SummariedReport.tsx
// components/employeelist/LinkSummaryReport.tsx
import Link from 'next/link';

interface LinkSummariedReportProps {
  slackUserId: string;
  className?: string;
}

export default function LinkSummariedReportReport({
  slackUserId,
  className = '',
}: LinkSummariedReportProps) {
  return (
    <Link
      href={`/employee-list/summaried_report/${slackUserId}`}
      className='bg-[#66B2FF] text-[17px] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#003366] transition-colors duration-300 inline-flex items-center' // inline-flex and items-center added
    >
      <img src='/employee-list/summarize.png' alt='Icon' className='w-7 h-7 mr-1' />
      日報サマリーを見る
    </Link>
  );
}
