// frontend/src/app/pricing/page.tsx
import React from 'react';
import PriceList from '../../components/payment/PriceList';
import LogoRblue from '../../components/payment/LogoRblue';

export default function PricingPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow flex flex-col items-center justify-center bg-[#003366]'>
        <LogoRblue />
        <h1 className='text-2xl mb-8 text-white'>お支払いプランを選択</h1>
        <PriceList />
      </div>
    </div>
  );
}
