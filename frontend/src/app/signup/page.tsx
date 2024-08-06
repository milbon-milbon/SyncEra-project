// frontend/src/app/signup/page.tsx
'use client'; 
import React from 'react';
import Link from 'next/link';

const SignUp: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-4xl font-bold mb-4 text-[#003366]">ご登録フォーム</h1>
      {/* 登録フォームを配置 */}
      <form className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md">
        {/* フォーム要素例 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            社名・団体名
          </label>
          <input
            type="name"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="office"
          />
        </div>
        <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                氏
    </label>
    <input
      type="text"
      id="lastName"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      placeholder=""
    />
  </div>
  <div className="w-1/2">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
      名
    </label>
    <input
      type="text"
      id="firstName"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      placeholder=""
    />
  </div>
</div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="example@example.com"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>
        <Link href="/pricing">
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] focus:outline-none "
          >
            次へ
          </button>
          </div>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
