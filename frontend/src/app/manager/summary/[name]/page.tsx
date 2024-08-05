"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Employee型を定義
type Employee = {
  name: string;
  department: string;
  role: string;
  project: string;
  imageUrl: string;
  report: string;
  times: string[];
  interests: string;
  careerGoals: string;
};

const employees = [
  {
    name: "みきこ",
    department: "開発部",
    role: "フロントエンドエンジニア",
    project: "プロジェクトA",
    imageUrl: "/images/mikiko.jpg",
    report: "今日はプロジェクトの進捗を報告しました。",
    times: ["午前中にチームとタスクの確認。", "午後から設計レビュー。"],
    interests: "最新技術のトレンド、UI/UXデザイン",
    careerGoals:
      "技術リーダーシップを発揮すること、プロジェクトマネージャーになること",
  },
  // 他の社員データ...
];

export default function EmployeeSummary() {
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const name = params.name as string;
    if (name) {
      const foundEmployee = employees.find(
        (emp) => emp.name === decodeURIComponent(name)
      );
      setEmployee(foundEmployee || null);
    }
  }, [params.name]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-[#003366] text-white p-4 flex items-center justify-between">
        <div className="text-4xl font-bold">SyncEra</div>
        <button
          onClick={() => router.back()}
          className="bg-[#66B2FF] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors duration-300"
        >
          一覧に戻る
        </button>
      </header>

      <div className="flex flex-1">
        {/* サイドバー */}
        <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <a href="/manager" className="hover:underline">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/employee-list" className="hover:underline">
                  社員一覧
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  ホームページへ戻る
                </a>
              </li>
            </ul>
          </nav>
          <button
            className="bg-[#66B2FF] text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
            onClick={() => router.push("/login")}
          >
            ログアウト
          </button>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 p-8 bg-gray-100">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md flex flex-col lg:flex-row border border-[#003366]">
            <div className="flex-1 lg:w-2/3">
              <h2 className="text-3xl font-bold mb-2 text-[#003366]">
                {employee.name}
              </h2>
              <p className="text-sm text-[#003366] mb-1">
                部署: {employee.department}
              </p>
              <p className="text-sm text-[#003366] mb-1">
                役職: {employee.role}
              </p>
              <p className="text-sm text-[#003366] mb-4">
                担当案件名: {employee.project}
              </p>

              <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-[#66B2FF]">
                <h3 className="font-semibold text-[#003366] mb-2">日報:</h3>
                <p>{employee.report}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-[#66B2FF]">
                <h3 className="font-semibold text-[#003366] mb-2">Times:</h3>
                <ul className="list-disc list-inside ml-5">
                  {employee.times.map((time: string, i: number) => (
                    <li key={i}>{time}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:w-1/3 lg:ml-4">
              {employee.imageUrl ? (
                <img
                  src={employee.imageUrl}
                  alt={`${employee.name}のイメージ`}
                  className="rounded-lg shadow-md w-full border border-[#003366]"
                />
              ) : (
                <div className="bg-[#F5F5F5] rounded-lg shadow-md w-full h-32 flex items-center justify-center border border-[#003366]">
                  画像なし
                </div>
              )}

              <div className="bg-white p-4 rounded-lg shadow-md mt-4 border border-[#66B2FF]">
                <h3 className="font-semibold text-[#003366] mb-2">興味:</h3>
                <p>{employee.interests}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md mt-4 border border-[#66B2FF]">
                <h3 className="font-semibold text-[#003366] mb-2">
                  キャリア志向:
                </h3>
                <p>{employee.careerGoals}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
