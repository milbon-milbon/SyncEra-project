'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from '@/components/signup_and_login/LoguoutButton';
import AuthRoute from '@/components/auth/AuthRoute';
{
  /*認証追加　by ku-min*/
}

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  project: string;
  slackUserId: string;
  slackUserId: string;
  imageUrl?: string;
};

export default function EmployeeRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    project: '',
    slackUserId: '',
    imageUrl: '', // SlackアイコンのURLを入力するフィールド
    slackUserId: '',
    imageUrl: '', // SlackアイコンのURLを入力するフィールド
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // SlackアイコンのURLをプレビュー表示
    if (e.target.name === 'imageUrl') {
      setImagePreview(e.target.value);
    }

    // SlackアイコンのURLをプレビュー表示
    if (e.target.name === 'imageUrl') {
      setImagePreview(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    router.push('/employee-list'); // 登録後に社員一覧ページにリダイレクト
    router.push('/employee-list'); // 登録後に社員一覧ページにリダイレクト
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      project: '',
      slackUserId: '',
      imageUrl: '',
      slackUserId: '',
      imageUrl: '',
    });
    setImagePreview(null);
    setImagePreview(null);
  };

  const handleLogout = () => {
    console.log('Logged out');
    router.push('/login');
    router.push('/login');
  };

  return (
    <AuthRoute requiredRole='manager'>
      {/*認証系：追加コンポーネント<AuthRoute />　by ku-min*/}
      <div className='min-h-screen flex'>
        {/* サイドバー */}
        <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
          <div className='text-3xl font-bold mb-8'>
            <img src='/image/SyncEra(blue_white).png' alt='SyncEra Logo' className='h-13' />
          </div>
          <nav className='flex-1'>
            <ul className='space-y-6'>
              <li>
                <Link href='/employee-list' className='hover:underline text-lg'>
                  社員一覧へ戻る
                </Link>
              </li>
              <li>
                <Link href='/' className='hover:underline text-lg'>
                  ホームページへ戻る
                </Link>
              </li>
            </ul>
          </nav>
          {/*マージの際、ログアウトボタン <LogoutButton />の差し替えをお願いします。認証関係です。by ku-min*/}
          <LogoutButton />
        </aside>

        {/* メインコンテンツ */}
        <main className='flex-1 flex items-center justify-center bg-[#f5f9fc] p-6'>
          <div className='bg-[#ffffff] p-8 rounded-lg shadow-lg w-full max-w-4xl flex'>
            {/* フォーム部分 */}
            <div className='flex-1 mr-8'>
              <h1 className='text-3xl font-bold mb-6 text-[#003366] text-center'>社員登録</h1>
              <form onSubmit={handleSubmit}>
                {['name', 'email', 'department', 'role', 'project', 'imageUrl'].map((field) => (
                  <div key={field} className='mb-6 flex items-center'>
                    <label htmlFor={field} className='block text-lg font-bold text-[#003366] w-44'>
                      {field === 'name'
                        ? '名前'
                        : field === 'email'
                        ? 'Email'
                        : field === 'department'
                        ? '部署名'
                        : field === 'role'
                        ? '役職'
                        : field === 'project'
                        ? '関わっている案件名'
                        : 'SlackアイコンURL'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      className='flex-1 rounded-md border border-[#66b2ff] bg-[#ffffff] shadow-inner text-lg p-3 focus:border-[#003366] focus:ring focus:ring-[#66b2ff] focus:ring-opacity-50'
                    />
                  </div>
                ))}
                <div className='flex justify-between mt-8'>
                  <button
                    type='submit'
                    className='px-6 py-3 bg-[#003366] text-white text-lg rounded-md hover:bg-[#002244] shadow-md transition-colors duration-300'
                  >
                    登録
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='px-6 py-3 bg-gray-300 text-gray-700 text-lg rounded-md hover:bg-gray-400 shadow-md transition-colors duration-300'
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
            {/* アイコンプレビュー部分 */}
            <div className='w-48 h-48 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg border-4 border-gray-400'>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt='Slack Icon Preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='bg-gray-200 w-full h-full flex items-center justify-center'>
                  アイコンなし
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
