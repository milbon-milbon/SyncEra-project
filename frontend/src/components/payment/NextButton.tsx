// frontend/src/components/payment/Next.Button.tsx
'use client';
import React from 'react';
import Link from 'next/link';

const NextButton: React.FC = () => {
  const handleClick = () => {
    console.log('Button clicked'); // ボタンがクリックされたときにログを出力
  };
  return (
    <Link href='/pricing'>
      <div className='flex justify-center'>
        <button
          type='submit'
          className='mt-6 w-full px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] focus:outline-none '
          onClick={handleClick} // onClickイベントを追加
        >
          次へ
        </button>
      </div>
    </Link>
  );
};

export default NextButton;
