// src/app/components/payment/PriceList.tsx
'use client';
import React from 'react';
import PriceCard from './PriceCard';
import clientLogger from '@/lib/clientLogger';

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

export default function PriceList() {
  const handleCheckout = async (priceId: string) => {
    clientLogger.info(`チェックアウト開始時: ${priceId}`);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price_id: priceId }),
      });

      const { url } = await response.json();
      clientLogger.info(`成功時のリダイレクトURL: ${url}`);
      window.location.href = url;
    } catch (error) {
      clientLogger.error('エラー発生');
    }
  };

  return (
    <div className='flex justify-center overflow-x-auto'>
      {prices.map((price) => (
        <div key={price.id} className='w-64 flex-shrink-0 mx-2'>
          <PriceCard
            priceId={price.id}
            name={price.name}
            amount={price.amount}
            image={price.image}
            onSelect={handleCheckout}
          />
        </div>
      ))}
    </div>
  );
}
