// src/app/components/PriceCard.tsx
'use client';
import React from 'react';

interface PriceCardProps {
  priceId: string;
  name: string;
  amount: number;
  image: string;
  onSelect: (priceId: string) => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ image, name, priceId, amount, onSelect }) => {
  const handleSelectClick = (priceId: string) => {
    console.log(`Selected plan: ${name}, Price ID: ${priceId}`); // ログ出力
    onSelect(priceId); // 実際のonSelect関数を呼び出す
  };
  return (
    <div className='bg-white rounded-lg shadow-md p-5 m-1 w-full max-w-sm text-gray-600'>
      <img
        src={image}
        alt={`${name} プラン`}
        className='mb-4 w-full'
        style={{ height: '150px', objectFit: 'cover' }}
      />
      <h2 className='text-xl font-semibold mb-4 text-center'>{name}</h2>
      <h3 className='text-center mb-12 text-black'>
        Price: <span className='text-2xl font-bold text-black'>¥{amount}</span>
      </h3>
      <div className='flex justify-center'>
        <button
          className='bg-[#66b2ff] text-black py-2 px-4 rounded-full hover:bg-[#99ccff] focus:outline-none'
          onClick={() => onSelect(priceId)}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default PriceCard;
