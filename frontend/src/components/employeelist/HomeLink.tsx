// // components/employeelist/HomeLink.tsx
'use client';
import Link from 'next/link';

export default function HomeLink() {
  return (
    <li>
      <Link href='/' className='block text-lg text-white hover:underline flex items-center'>
        <img src='/employee-list/home.png' alt='新規登録' className='w-8 h-8 mr-2' />
        ホーム
      </Link>
    </li>
  );
}
