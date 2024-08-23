// // Loading画面をいれたい

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from '@/components/signup_and_login/LogoutButton';
import AuthRoute from '@/components/auth/AuthRoute';
import HomeLink from '@/components/employeelist/HomeLink';
import EmployeeLink from '@/components/employeelist/EmployeeLink';
import LogoWhite from '@/components/employeelist/LogoWhite';
export default function EmployeeRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    project: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // `handleSubmit` をラップする関数
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // バックエンドAPI（エンドポイント/client/add_employee_info/ )にデータを送信
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch('${apiUrl}/client/add_employee_info/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          role: formData.role,
          project: formData.project,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail); // サーバーからのエラーメッセージを取得
      }

      // 成功したら社員一覧ページにリダイレクト
      router.push('/employee-list');
    } catch (error) {
      alert('社員登録に失敗しました。');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      project: '',
    });
  };

  return (
    <AuthRoute requiredRole='manager'>
      <div className='min-h-screen flex'>
        <aside className='w-64 bg-[#003366] text-white p-6 flex flex-col'>
          <LogoWhite />
          <nav className='flex-1'>
            <ul className='space-y-6  mt-5'>
              <EmployeeLink />
              <HomeLink />
            </ul>
          </nav>
          <LogoutButton />
        </aside>

        {/* メインコンテンツ */}
        <main className='flex-1 flex items-center justify-center bg-[#f5f9fc] p-6'>
          <div className='bg-[#ffffff] p-8 rounded-lg shadow-lg w-full max-w-4xl flex'>
            {/* フォーム部分 */}
            <div className='flex-1 mr-8'>
              <h1 className='text-3xl font-bold mb-6 text-[#003366] text-center'>社員登録</h1>
              <form onSubmit={onSubmit}>
                {['name', 'email', 'department', 'role', 'project'].map((field) => (
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
                        : '関わっている案件名'}
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
                <div className='flex justify-end mt-8 space-x-4'>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-[#003366] text-white text-lg rounded-md hover:bg-[#002244] shadow-md transition-colors duration-300'
                  >
                    登録
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='px-4 py-2 bg-gray-300 text-gray-700 text-lg rounded-md hover:bg-gray-400 shadow-md transition-colors duration-300'
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
