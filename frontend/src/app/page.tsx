// frontend/src/app/page.tsx`
'use client';

import React from 'react';
import PlanIntro from '../components/payment/PlanIntro';
import CompanyLoginButton from '@/components/signup_and_login/CompanyLoginButton';

export default function HomePage() {
  return (
    <div className='container'>
      <CompanyLoginButton />
      <PlanIntro />
    </div>
  );
}
