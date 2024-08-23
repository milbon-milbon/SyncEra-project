// // components/employeelist/EmployeeLink.tsx
'use client';
import Link from 'next/link';

export default function EmployeeLink() {
  return (
    <li>
      <Link
        href='/employee-list'
        className='block text-lg text-white hover:underline flex items-center'
      >
        {' '}
        <img src='/employee-list/person_pin.png' alt='新規登録' className='w-8 h-8 mr-2' />
        社員一覧トップ
      </Link>
    </li>
  );
}
