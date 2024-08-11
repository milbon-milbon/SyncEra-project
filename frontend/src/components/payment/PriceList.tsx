// frontend/src/app/components/payment/PriceList.tsx

'use client';

import React from 'react';
import PriceCard from './PriceCard';

const prices = [
  {
    id: 'price_1PkIPd1RdH0G9zt6VKHyrcSD',
    name: '月額',
    amount: 1000,
    image: './payment/month.png',
  },
  {
    id: 'price_1PkNmT1RdH0G9zt6IHaDVLOb',
    name: '年払',
    amount: 12000,
    image: './payment/year.png',
  },
];

interface PriceListProps {
  onPriceSelect: (priceId: string) => void;
}

export default function PriceList({ onPriceSelect }: PriceListProps) {
  return (
    <div className='flex justify-center space-x-4'>
      {prices.map((price) => (
        <PriceCard
          key={price.id}
          priceId={price.id}
          name={price.name}
          amount={price.amount}
          image={price.image}
          onSelect={onPriceSelect}
        />
      ))}
    </div>
  );
}
