// frontend/src/app/page.tsx`
'use client';

import React from 'react';
import PlanIntro from '../components/payment/PlanIntro';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <PlanIntro />
    </div>
  );
}