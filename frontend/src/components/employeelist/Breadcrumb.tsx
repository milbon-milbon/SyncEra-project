// 社員一覧トップ（バーで使う）
import Link from 'next/link';

interface BreadcrumbProps {
  currentPage: string; // 現在のページ名
}

export default function Breadcrumb({ currentPage }: BreadcrumbProps) {
  return (
    <div className='flex items-center flex-wrap'>
      <Link href='/employee-list' className='hover:text-[#003366] text-[17px] text-gray-600 mr-2'>
        社員一覧トップ
      </Link>
      <span className='text-[17px] text-gray-600 mr-2'>{' 〉'}</span>
      <span className='text-[17px] text-gray-600'>{currentPage}</span>
    </div>
  );
}
