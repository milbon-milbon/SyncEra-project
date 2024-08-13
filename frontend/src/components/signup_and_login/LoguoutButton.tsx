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
      router.push('/login/employee');
    } catch (error) {
      clientLogger.error(`Logout failed:,${error}`);
      alert('ログアウトに失敗しました。');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 focus:outline-none mt-4'
    >
      ログアウト
    </button>
  );
}
