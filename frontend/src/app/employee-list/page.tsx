/*
"use client";

import { useRouter } from "next/navigation"; // クライアントサイドのルーティング用
import Link from "next/link";
import { useState } from "react";

// Sample data for employees
const employees = [
  {
    name: "みきこ",
    department: "開発部",
    role: "フロントエンドエンジニア",
    project: "プロジェクトA",
    imageUrl: "/image/mikiko.jpg",
  },
  {
    name: "めめ",
    department: "デザイン部",
    role: "UI/UXデザイナー",
    project: "プロジェクトA",
    imageUrl: "/image/meme.jpg",
  },
  {
    name: "さよこ",
    department: "開発部",
    role: "バックエンドエンジニア",
    project: "プロジェクトA",
    imageUrl: "/image/sayoko.jpg",
  },
  {
    name: "くーみん",
    department: "品質保証部",
    role: "QAエンジニア",
    project: "プロジェクトA",
    imageUrl: "/image/coomin.jpg",
  },
];

export default function Manager() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleViewDetails = (employeeName: string) => {
    console.log(
      `Navigating to /employee-list/summary/${encodeURIComponent(employeeName)}`
    );
    router.push(`/manager/summary/${encodeURIComponent(employeeName)}`);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-3xl font-bold mb-4">
          <img
            src="/image/SyncEra(blue_white).png"
            alt="SyncEra Logo"
            className="h-13"
          />
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/employee-list" className="hover:underline">
                社員登録
              </Link>
            </li>
            <li>
              <Link href="/employee-list" className="hover:underline">
                社員一覧
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                ホームページへ戻る
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="bg-[#66B2FF] text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
          onClick={handleLoginLogout}
        >
          {isLoggedIn ? "ログアウト" : "ログイン"}
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">社員一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex items-start relative border border-gray-300"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{employee.name}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  部署: {employee.department}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  役職: {employee.role}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  担当案件名: {employee.project}
                </p>
                <button
                  onClick={() => handleViewDetails(employee.name)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300 mt-2"
                >
                  詳細を見る
                </button>
              </div>
              <div className="w-1/3 ml-4">
                {employee.imageUrl ? (
                  <img
                    src={employee.imageUrl}
                    alt={`${employee.name}のイメージ`}
                    className="rounded-lg shadow-md w-full"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg shadow-md w-full h-32 flex items-center justify-center">
                    画像なし
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useEmployees } from "../hooks/useEmployees";

// 従業員の型定義
type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  project: string;
  imageUrl?: string;
  slack_user_id: string;
};

export default function EmployeeList() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { employees, loading, error } = useEmployees();

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleViewDetails = (slackUserId: string) => {
    try {
      router.push(`/employee-list/summary/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error("Navigation error:", error);
      // ここでユーザーにエラーを通知するなどの処理を追加できます
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-3xl font-bold mb-4">
          <img
            src="/image/SyncEra(blue_white).png"
            alt="SyncEra Logo"
            className="h-13"
          />
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/employee-list" className="hover:underline">
                社員登録
              </Link>
            </li>
            <li>
              <Link href="/employee-list" className="hover:underline">
                社員一覧
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                ホームページへ戻る
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="bg-[#66B2FF] text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
          onClick={handleLoginLogout}
        >
          {isLoggedIn ? "ログアウト" : "ログイン"}
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">社員一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white p-6 rounded-lg shadow-md flex items-start relative border border-gray-300"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{employee.name}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  部署: {employee.department}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  役職: {employee.role}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  担当案件名: {employee.project}
                </p>
                <button
                  onClick={() => handleViewDetails(slackUserId: string) =></div>}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300 mt-2"
                >
                  詳細を見る
                </button>
              </div>
              <div className="w-1/3 ml-4">
                {employee.imageUrl ? (
                  <img
                    src={employee.imageUrl}
                    alt={`${employee.name}のイメージ`}
                    className="rounded-lg shadow-md w-full"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg shadow-md w-full h-32 flex items-center justify-center">
                    画像なし
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
*/

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useEmployees } from "../hooks/useEmployees";

// 従業員の型定義
type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  project: string;
  slack_user_id: string;
};

export default function EmployeeList() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { employees, loading, error } = useEmployees();

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleViewDetails = (slackUserId: string) => {
    try {
      router.push(`/employee-list/summary/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error("Navigation error:", error);
      // ここでユーザーにエラーを通知するなどの処理を追加できます
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-3xl font-bold mb-4">
          <img
            src="/image/SyncEra(blue_white).png"
            alt="SyncEra Logo"
            className="h-13"
          />
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/employee-list" className="hover:underline">
                社員登録
              </Link>
            </li>
            <li>
              <Link href="/employee-list" className="hover:underline">
                社員一覧
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                ホームページへ戻る
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="bg-[#66B2FF] text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
          onClick={handleLoginLogout}
        >
          {isLoggedIn ? "ログアウト" : "ログイン"}
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">社員一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white p-6 rounded-lg shadow-md flex items-start relative border border-gray-300"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{employee.name}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  部署: {employee.department}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  役職: {employee.role}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  担当案件名: {employee.project}
                </p>
                <button
                  onClick={() => handleViewDetails(employee.slack_user_id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300 mt-2"
                >
                  詳細を見る
                </button>
              </div>
              <div className="w-1/3 ml-4">
                {employee.imageUrl ? (
                  <img
                    src={employee.imageUrl}
                    alt={`${employee.name}のイメージ`}
                    className="rounded-lg shadow-md w-full"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg shadow-md w-full h-32 flex items-center justify-center">
                    画像なし
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
