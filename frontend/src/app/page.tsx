// frontend/src/app/page.tsx`
'use client';

import React from 'react';
import PlanIntro from '../components/payment/PlanIntro';
import CompanyLoginButton from '@/components/signup_and_login/CompanyLoginButton';
import LoginButton from '@/components/signup_and_login/LoginButton';

export default function HomePage() {
  return (
    <div className='container'>
      <CompanyLoginButton />
      <LoginButton />
      <PlanIntro />
    </div>
  );
}
