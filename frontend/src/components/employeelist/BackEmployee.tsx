// 社員一覧に戻るボタン
// components/employeelist/BackEmpliyee.tsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function BackEmployee() {
  return (
    <Link href='/employee-list'>
      <button className='bg-gray-300   hover:bg-[#c0c0c0] text-[#003366] py-2 px-4 rounded-lg  text-[17px]'>
        戻る
      </button>
    </Link>
  );
}
