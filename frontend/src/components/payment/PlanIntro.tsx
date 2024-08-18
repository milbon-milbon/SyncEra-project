'use client';
import React from 'react';
import Link from 'next/link';
import clientLogger from '@/lib/clientLogger';

export default function PlanIntro() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => {
    clientLogger.info('ボタンクリック');
    // e.preventDefault(); // デバッグ時にページ遷移を防ぎたい場合に使用
  };

  return (
    <div className='flex flex-col items-center justify-center p-3 bg-white max-w-3xl mx-auto'>
      <h1 className='text-4xl font-bold mb-8 text-center'>料金のご案内</h1>
      <div className='flex flex-col md:flex-row gap-6 w-full mb-8'>
        <div className='flex-1 border rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow'>
          <h2 className='text-3xl font-semibold mb-4 text-center bg-white text-[#003366] border-b-2 border-[#66b2ff]'>
            月額
          </h2>
          <p className='text-center font-bold text-3xl mb-4 text-[#003366]'>¥1,000 / 月</p>
          <ul className='space-y-2 text-[17px]'>
            <li className='flex items-center'>
              <span className='flex justify-center items-center w-6 h-6 bg-white border border-[#66b2ff] rounded-full mr-2'>
                <svg
                  className='w-4 h-4 text-[#003366]'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </span>
              毎月のお支払い
            </li>
            <li className='flex items-center'>
              <span className='flex justify-center items-center w-6 h-6 bg-white border border-[#66b2ff] rounded-full mr-2'>
                <svg
                  className='w-4 h-4 text-[#003366]'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </span>
              柔軟に解約可能
            </li>
            <li className='flex items-center'>
              <span className='flex justify-center items-center w-6 h-6 bg-white border border-[#66b2ff] rounded-full mr-2'>
                <svg
                  className='w-4 h-4 text-[#003366]'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </span>
              成長に合わせて調整可能
            </li>
          </ul>
        </div>
        <div className='flex-1 border rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow'>
          <h2 className='text-3xl font-semibold mb-4 text-center bg-white text-[#003366] border-b-2 border-[#66b2ff]'>
            年払
          </h2>
          <p className='text-center font-bold text-3xl  mb-4 text-[#003366]'>¥12,000 / 年</p>
          <ul className='space-y-2 text-[17px]'>
            <li className='flex items-center '>
              <span className='flex justify-center items-center w-6 h-6 bg-white border border-[#66b2ff] rounded-full mr-2'>
                <svg
                  className='w-4 h-4 text-[#003366]'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </span>
              長期的な計画に最適
            </li>
            <li className='flex items-center'>
              <span className='flex justify-center items-center w-6 h-6 bg-white border border-[#66b2ff] rounded-full mr-2'>
                <svg
                  className='w-4 h-4 text-[#003366]'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </span>
              料金改定の影響を受けにくい
            </li>
            <li className='flex items-center'>
              <span className='flex justify-center items-center w-6 h-6 bg-white border border-[#66b2ff] rounded-full mr-2'>
                <svg
                  className='w-4 h-4 text-[#003366]'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </span>
              年間のコスト管理が容易
            </li>
          </ul>
        </div>
      </div>
      <p className='text-center text-gray-600 '>
        どちらのプランも、すべての機能をご利用いただけます。
      </p>
      <Link href='/signup'>
        <button
          onClick={handleClick}
          className='mt-8 px-6 py-3 bg-[#003366] text-white rounded hover:bg-[#002244] focus:outline-none mb-1 font-bold'
        >
          アカウントを作成する
        </button>
      </Link>
    </div>
  );
}
