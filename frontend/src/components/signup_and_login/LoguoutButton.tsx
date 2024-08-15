'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import clientLogger from '@/lib/clientLogger';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clientLogger.info('User logged out successfully');
      alert(`ログアウトしました。`);
      router.push('/');
    } catch (error) {
      clientLogger.error(`Logout failed:,${error}`);
      alert('ログアウトに失敗しました。');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='bg-[#66B2FF] text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-8 w-full'
    >
      ログアウト
    </button>
  );
}
