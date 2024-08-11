// frontend/src/app/signup/page.tsx ==新規登録画面==変更前

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '@/firebase/config'; // Firebase app の初期化
import clientLogger from '@/lib/clientLogger';
import LogoWblue from '@/components/payment/LogoWblue';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface AdminClaimsResponse {
  message: string;
}
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clientLogger.info('==== handleSubmit 関数が呼び出されました==== ');
    try {
      const auth = getAuth(app);
      const functions = getFunctions(app);
      const db = getFirestore(app);

      // ユーザーを作成し、UIDを取得
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      clientLogger.info(`==== ユーザー登録成功==== : ${user.uid}`);
      // UIDを確認
      console.log('==== User UIDを確認==== :', user.uid); // ここでUIDを確認
      // Firestoreに企業情報を登録
      await setDoc(doc(db, 'companies', user.uid), {
        companyName,
        email,
        firstName,
        lastName,
        uid: user.uid,
      });

      // カスタムクレームを設定 (サーバーサイドのCloud Functionを呼び出し)
      const setAdminClaims = httpsCallable<{ uid: string }, AdminClaimsResponse>(
        functions,
        'setAdminClaims',
      );
      console.log('Sending data to Cloud Function:', { uid: user.uid });
      try {
        const result = await setAdminClaims({ uid: user.uid });
        console.log('Raw Cloud Function result:', result);
        if (result.data && result.data.message) {
          console.log('Cloud Function result data:', result.data);
          // 成功した場合の処理
          router.push('/pricing');
          clientLogger.info('==== pricing ページへの遷移が完了しました==== ');
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error: any) {
        console.error('Error calling Cloud Function:', error);
        clientLogger.error(`==== サインアップエラー==== : ${error.message}`);
        // エラーメッセージをユーザーに表示するなどの処理をここに追加
        throw error; // エラーを上位に伝播させる
      }
    } catch (error: any) {
      clientLogger.error(`==== サインアップエラー==== : ${error.message}`);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-white'>
      <LogoWblue />
      <form
        className='bg-gray-100 md:p-[35px] p-6 rounded-lg shadow-lg max-w-md'
        onSubmit={handleSubmit}
      >
        <h1 className='text-center text-2xl font-bold mb-4 text-[#003366]'>ご登録フォーム</h1>
        <div className='mb-2'>
          <label className='block text-[#003366] text-[17px] font-bold mb-0' htmlFor='companyName'>
            社名・団体名
          </label>
          <input
            type='text'
            id='companyName'
            name='companyName'
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className='input-with-icon-1 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='office_name'
            required
            autoComplete='off'
          />
        </div>
        <div className='mb-2 flex space-x-4'>
          <div className='w-1/2'>
            <label className='block text-[#003366] text-[17px] font-bold mb-0' htmlFor='lastName'>
              氏
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='input-with-icon-2 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
              placeholder='name'
              required
              autoComplete='off'
            />
          </div>
          <div className='w-1/2'>
            <label className='block text-[#003366] text-[17px] font-bold mb-0' htmlFor='firstName'>
              名
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
              placeholder=''
              required
              autoComplete='off'
            />
          </div>
        </div>
        <div className='mb-2'>
          <label className='block text-[#003366] text-[17px] font-bold mb-0' htmlFor='email'>
            メールアドレス
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input-with-icon-3 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='email'
            required
            autoComplete='off'
          />
        </div>
        <div className='mb-8'>
          <label className='block text-[#003366] text-[17px] font-bold mb-0' htmlFor='email'>
            パスワード
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input-with-icon-4 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='password'
            required
            autoComplete='off'
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className=' bg-[#66b2ff] text-white py-2 px-[170px] rounded-full hover:bg-[#99ccff] focus:outline-none'
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
}
