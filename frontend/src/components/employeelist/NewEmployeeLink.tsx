// // components/employeelist/NewEmployeeLink.tsx
'use client';
import Link from 'next/link';

export default function NewEmployeeLink() {
  return (
    <li>
      <Link
        href='/employee-list/employee_registration'
        className='block text-lg text-white hover:underline flex items-center'
      >
        {' '}
        <img src='/employee-list/person_add.png' alt='新規登録' className='w-8 h-8 mr-2' />
        社員登録
      </Link>
    </li>
  );
}
