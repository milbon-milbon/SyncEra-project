"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type EmployeeInfo = {
  department: string;
  email: string;
  id: string;
  name: string;
  project: string;
  role: string;
  slack_user_id: string;
};

type DailyReport = {
  id: number;
  text: string;
  ts: string;
  user_id: string;
};

type EmployeeData = [EmployeeInfo, DailyReport];

export default function EmployeeDetailPage() {
  // console.log("エラー");
  const params = useParams();
  console.log(params);
  const slack_user_id = params.slack_user_id as string;
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null); // Adjust type based on actual structure
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployeeData() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/client/selected_employee/${slack_user_id}/`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch employee data: ${response.status}`);
        }
        console.log(response);
        const data = await response.json();
        console.log(data);

        setEmployeeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (slack_user_id) {
      fetchEmployeeData();
    }
  }, [slack_user_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employeeData) return <div>従業員データが見つかりません</div>;

  // employeeData から必要なデータを取り出します
  // const { employeeInfo, dailyReport } = employeeData;
  // console.log(employeeInfo);
  // console.log(dailyReport);

  return (
    <div className="min-h-screen flex flex-col">
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
        <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-4">
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
          <Link
            href="/login"
            className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto inline-block text-center"
          >
            ログアウト
          </Link>
        </aside>

        <main className="flex-1 p-8 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">
              {employeeData[0].name}の日報
            </h2>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 text-[#003366]">
                社員情報
              </h3>
              <p>
                <strong>部署:</strong> {employeeData[0].department}
              </p>
              <p>
                <strong>プロジェクト:</strong> {employeeData[0].project}
              </p>
              <p>
                <strong>役職:</strong> {employeeData[0].role}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[#003366]">
                最新の日報
              </h3>
              <p className="text-lg whitespace-pre-wrap">
                {employeeData[1].text}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                投稿日時:{" "}
                {/* {new Date(parseInt(employeeData[1].ts) * 1000).toLocaleString()} */}
                => employeeData[1].ts では、小数点を含む数値が文字列として渡されています（参考：backend/db/models.py）
                => かつ、unix型という日時の表し方なので、それを YYYY-MM-DD 形式に直す必要があります。
                => 1. 小数点を含む数値の文字列を、parseInt()の引数には渡せないので、parseFloatを使って数値に直します。
                => 2. YYYY, MM, DD ごとに形を整えます
              　{
                 (() => {
							      const timestamp = parseFloat(employeeData[1].ts);
							      const date = new Date(timestamp * 1000); // UNIXタイムスタンプをミリ秒に変換
							      const year = date.getFullYear(); // 年を取得
							      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月を取得（0始まりなので+1）し、ゼロ埋め
							      const day = date.getDate().toString().padStart(2, '0'); // 日を取得し、ゼロ埋め
							      return `${year}-${month}-${day}`; // "YYYY-MM-DD" 形式で返す
							    })()
							  }
              </p>
              {/* サマリー画面へのリンクボタン */}
              <div className="mt-4">
                <Link
                  href={`/employee-list/summaried_report/${slack_user_id}/?start_date=2024-08-01&end_date=2024-08-07`}
                  className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 inline-block"
                >
                  日報サマリーを見る
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// import { useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";

// export default function EmployeeDetailPage() {
//   console.log("エラー");
//   const params = useParams();
//   console.log(params);
//   const slack_user_id = params.slack_user_id as string;
//   const [employeeData, setEmployeeData] = useState<any>(null); // Adjust type based on actual structure
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchEmployeeData() {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `http://localhost:8000/client/selected_employee/${slack_user_id}/`
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to fetch employee data: ${response.status}`);
//         }
//         console.log(response);
//         const data = await response.json();
//         console.log(data);

//         setEmployeeData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (slack_user_id) {
//       fetchEmployeeData();
//     }
//   }, [slack_user_id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!employeeData) return <div>従業員データが見つかりません</div>;

//   // employeeData から必要なデータを取り出します
//   const { employeeInfo, dailyReport } = employeeData;
//   console.log(employeeInfo);
//   console.log(dailyReport);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="bg-[#003366] text-white p-4 flex items-center justify-between">
//         <div className="text-4xl font-bold">
//           <img
//             src="/image/SyncEra(blue_white).png"
//             alt="SyncEra Logo"
//             className="h-16"
//           />
//         </div>
//       </header>

//       <div className="flex flex-1">
//         <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
//           <nav className="flex-1">
//             <ul className="space-y-4">
//               <li>
//                 <Link href="/employee-list" className="hover:underline">
//                   社員一覧
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/" className="hover:underline">
//                   ホームページへ戻る
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//           <Link
//             href="/login"
//             className="bg-[#66B2FF] text-lg text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto inline-block text-center"
//           >
//             ログアウト
//           </Link>
//         </aside>

//         <main className="flex-1 p-8 bg-gray-100">
//           <div className="bg-white p-6 rounded-lg shadow-md border border-[#003366]">
//             <h2 className="text-3xl font-bold mb-4 text-[#003366]">
//               {employeeInfo[0].name}の日報
//             </h2>
//             <div className="mb-6">
//               <h3 className="text-2xl font-semibold mb-2 text-[#003366]">
//                 社員情報
//               </h3>
//               <p>
//                 <strong>部署:</strong> {employeeInfo[0].department}
//               </p>
//               <p>
//                 <strong>プロジェクト:</strong> {employeeInfo[0].project}
//               </p>
//               <p>
//                 <strong>役職:</strong> {employeeInfo[0].role}
//               </p>
//             </div>
//             <div>
//               <h3 className="text-2xl font-semibold mb-2 text-[#003366]">
//                 最新の日報
//               </h3>
//               <p className="text-lg whitespace-pre-wrap">
//                 {dailyReport[1].text}
//               </p>
//               <p className="text-sm text-gray-500 mt-2">
//                 投稿日時:{" "}
//                 {new Date(parseInt(dailyReport.ts) * 1000).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
