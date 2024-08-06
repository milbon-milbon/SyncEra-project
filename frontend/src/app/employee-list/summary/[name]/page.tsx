/*

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
  report: {
    content: string;
    tasks: string;
    progress: string;
    insights: string;
    concerns: string;
  };
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
    report: {
      content: "今日はプロジェクトの進捗を報告しました。",
      tasks: "午前中にチームとタスクの確認。午後から設計レビュー。",
      progress: "進捗は順調で、予定通りに進んでいます。",
      insights: "設計レビューで新しい技術の発見がありました。",
      concerns:
        "特にありませんが、次のフェーズでリスクが発生する可能性があります。",
    },
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
      {/* ヘッダー */ /*}
      <header className="bg-[#003366] text-white p-4 flex items-center justify-between">
        <div className="text-4xl font-bold">SyncEra</div>
      </header>

      <div className="flex flex-1">
        {/* サイドバー */ /*}
        <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <span className="hover:underline">Dashboard</span>
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

        {/* メインコンテンツ */ /*}
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
                <p>{employee.report.content}</p>
                <h4 className="font-semibold text-[#003366] mt-4">業務内容:</h4>
                <p>{employee.report.tasks}</p>
                <h4 className="font-semibold text-[#003366] mt-4">進捗状況:</h4>
                <p>{employee.report.progress}</p>
                <h4 className="font-semibold text-[#003366] mt-4">
                  所感・気づき:
                </h4>
                <p>{employee.report.insights}</p>
                <h4 className="font-semibold text-[#003366] mt-4">
                  確認事項・懸念点:
                </h4>
                <p>{employee.report.concerns}</p>
              </div>
            </div>

            <div className="lg:w-1/3 lg:ml-4">
              <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-[#66B2FF]">
                <h3 className="font-semibold text-[#003366] mb-2">興味:</h3>
                <p>{employee.interests}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-[#66B2FF]">
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

*/

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Employee型を定義
type Employee = {
  name: string;
  department: string;
  role: string;
  project: string;
  imageUrl: string;
  report: {
    content: string;
    tasks: string;
    progress: string;
    insights: string;
    concerns: string;
  };
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
    report: {
      content: "今日はプロジェクトの進捗を報告しました。",
      tasks: "午前中にチームとタスクの確認。午後から設計レビュー。",
      progress: "進捗は順調で、予定通りに進んでいます。",
      insights: "設計レビューで新しい技術の発見がありました。",
      concerns:
        "特にありませんが、次のフェーズでリスクが発生する可能性があります。",
    },
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
        <div className="text-4xl font-bold">
          <img
            src="/image/SyncEra(blue_white).png"
            alt="SyncEra Logo"
            className="h-16"
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* サイドバー */}

        <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-4">
              <li>
                <span className="text-lg hover:underline">Dashboard</span>
              </li>
              <li>
                <Link href="/manager" className="hover:underline">
                  社員一覧
                </Link>
              </li>
              <li>
                <a href="/" className="text-lg hover:underline">
                  ホームページへ戻る
                </a>
              </li>
            </ul>
          </nav>
          <button
            className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
            onClick={() => router.push("/login")}
          >
            ログアウト
          </button>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 p-8 bg-gray-100">
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-[#003366]">
                {employee.name}
              </h2>
              <p className="text-xl text-[#003366] mb-1">
                部署: {employee.department}
              </p>
              <p className="text-xl text-[#003366] mb-1">
                役職: {employee.role}
              </p>
              <p className="text-xl text-[#003366] mb-4">
                担当案件名: {employee.project}
              </p>
            </div>

            <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md flex flex-col lg:flex-row border border-[#003366] space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <div className="bg-white p-4 rounded-lg shadow-md border border-[#66B2FF] mb-4 lg:mb-0">
                  <h3 className="text-2xl font-semibold text-[#003366] mb-2">
                    日報:
                  </h3>
                  <p className="text-lg">{employee.report.content}</p>
                  <h4 className="text-xl font-semibold text-[#003366] mt-4">
                    業務内容:
                  </h4>
                  <p className="text-lg">{employee.report.tasks}</p>
                  <h4 className="text-xl font-semibold text-[#003366] mt-4">
                    進捗状況:
                  </h4>
                  <p className="text-lg">{employee.report.progress}</p>
                  <h4 className="text-xl font-semibold text-[#003366] mt-4">
                    所感・気づき:
                  </h4>
                  <p className="text-lg">{employee.report.insights}</p>
                  <h4 className="text-xl font-semibold text-[#003366] mt-4">
                    確認事項・懸念点:
                  </h4>
                  <p className="text-lg">{employee.report.concerns}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-4 lg:w-1/3">
                <div className="bg-white p-4 rounded-lg shadow-md border border-[#66B2FF]">
                  <h3 className="text-2xl font-semibold text-[#003366] mb-2">
                    興味:
                  </h3>
                  <p className="text-lg">{employee.interests}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border border-[#66B2FF]">
                  <h3 className="text-2xl font-semibold text-[#003366] mb-2">
                    キャリア志向:
                  </h3>
                  <p className="text-lg">{employee.careerGoals}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
