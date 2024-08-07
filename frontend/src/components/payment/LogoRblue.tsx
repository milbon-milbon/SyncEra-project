// frontend/src/components/payment/LogoRblue.tsx
'use client';
import React from 'react';

const LogoRblue: React.FC = () => {
  return (
    <img
      src='/payment/darkblue_1.png' // ロゴのパスを指定
      alt='Logo'
      className='absolute left-[510px] top-[100px]  w-25 h-9' // ロゴの位置と大きさを指定
    />
  );
};

export default LogoRblue;
