// frontend/src/app/signup/page.tsx ==新規登録画面

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '@/firebase/config'; // Firebase app の初期化
import clientLogger from '@/lib/clientLogger';
import Link from 'next/link';
import { getFunctions, httpsCallable } from 'firebase/functions';
import '@/app/signup/globals.css';
import Loading from '../../components/loading';
interface AdminClaimsResponse {
  message: string;
}
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading状態を追加

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ローディング開始
    clientLogger.info('==== handleSubmit 関数が呼び出されました==== ');
    try {
      const auth = getAuth(app);
      const functions = getFunctions(app);
      const db = getFirestore(app);

      // ユーザーを作成し、UIDを取得
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      clientLogger.debug(`==== ユーザー登録成功==== : ${user.uid}`);
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

      try {
        const result = await setAdminClaims({ uid: user.uid });
        if (result.data && result.data.message) {
          // 成功した場合の処理
          router.push('/pricing');
          clientLogger.info('==== pricing ページへの遷移が完了しました==== ');
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error: any) {
        clientLogger.error(`==== サインアップエラー==== : ${error.message}`);
        throw error; // エラーを上位に伝播させる
      }
    } catch (error: any) {
      clientLogger.error(`==== サインアップエラー==== : ${error.message}`);
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  if (loading) {
    return <Loading />; // loading中はLoadingコンポーネントを表示
  }

  return (
    <div className='my-custom-font flex flex-col min-h-screen bg-white '>
      <header className='bg-white text-[#003366]p-4 md:p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <img
            src='/logo/white_2.png'
            alt='SyncEra Logo'
            className='h-[65px] w-[207px] mt-2 ml-2'
          />

          <div className='flex items-center space-x-2'>
            <Link href='/'>
              <button className='bg-gray-200 text-[#003366] border px-4 py-2 rounded hover:bg-gray-300 active:transform active:translate-y-1 transition-colors duration-300'>
                ホーム
              </button>
            </Link>
            <span className='text-[#003366]'> 〉</span>
            <span className='text-[#003366] text-[20px] font-bold'>新規登録画面</span>
          </div>
        </div>
      </header>

      <form
        className='bg-gray-100 md:p-[35px] p-6 rounded-lg shadow-lg max-w-md absolute left-[37%] top-[200px]'
        onSubmit={handleSubmit}
      >
        <h1 className='text-center text-2xl font-bold mb-4 text-[#003366]'>ご登録フォーム</h1>
        <div className='mb-2'>
          <label className='block text-[#003366] text-[17px] font-bold mb-0' htmlFor='companyName'>
            会社・団体名
          </label>
          <input
            type='text'
            id='companyName'
            name='companyName'
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className='input-with-icon-1 shadow appearance-none border rounded w-full py-2 px-3 text-[#003366] leading-tight focus:outline-none focus:shadow-outline'
            placeholder='例）株式会社太陽'
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
              placeholder='例）山田'
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
              placeholder='花子'
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
            placeholder='例）example@email.com'
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
            placeholder='半角英数字'
            required
            autoComplete='off'
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className=' bg-[#66b2ff] text-white py-2 px-[170px] rounded-full hover:bg-[#99ccff] focus:outline-none active:transform active:translate-y-1  '
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
}
