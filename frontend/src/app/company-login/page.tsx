// frontend/src/app/company-login/page.tsx===企業ログイン画面===
// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getAuth, signInWithCustomToken } from 'firebase/auth';
// import app from '@/firebase/config';

// export default function CompanyLogin() {
//   const [companyId, setCompanyId] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const auth = getAuth(app);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       // バックエンドAPIを呼び出して、カスタムトークンを取得
//       const response = await fetch('/api/company-login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ companyId }),
//       });

//       if (!response.ok) {
//         throw new Error('ログインに失敗しました');
//       }

//       const { customToken } = await response.json();

//       // カスタムトークンでFirebase認証
//       await signInWithCustomToken(auth, customToken);

//       router.push('/admin-dashboard');
//     } catch (error) {
//       console.error('ログインエラー:', error);
//       setError('ログインに失敗しました。企業IDを確認してください。');
//     }
//   };

//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
//       <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
//         <h2 className='mb-4 text-2xl font-bold text-center'>企業ログイン</h2>
//         <div className='mb-4'>
//           <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='companyId'>
//             企業ID
//           </label>
//           <input
//             type='text'
//             id='companyId'
//             value={companyId}
//             onChange={(e) => setCompanyId(e.target.value)}
//             className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
//             placeholder='企業ID'
//             required
//           />
//         </div>
//         {error && <p className='text-red-500 text-xs italic mb-4'>{error}</p>}
//         <div className='flex items-center justify-between'>
//           <button
//             type='submit'
//             className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
//           >
//             ログイン
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
