// frontend/src/app/pricing/page.tsx
import React from 'react';
import PriceList from '../../components/payment/PriceList';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center bg-[#003366]">
      <img
            src="/payment/darkblue_1.png" // ロゴのパスを指定
            alt="Logo"
            className="absolute left-15 top-10 w-26 h-10" // ロゴの位置と大きさを指定
          />
        <h1 className="text-2xl mb-8 text-white">お支払いプランを選択</h1>
        <PriceList />
      </div>
      </div>
  );
};

export default PricingPage;