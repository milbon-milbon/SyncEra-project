// 'use client';

// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// export default function OneOnOneAdvicePage() {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [newAdvice, setNewAdvice] = useState('');
//   const [savedAdvices, setSavedAdvices] = useState([]);
//   const [selectedAdvice, setSelectedAdvice] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(true);

//   useEffect(() => {
//     const fetchSavedAdvices = async () => {
//       setSavedAdvices([
//         { id: 1, startDate: '2024-08-01', endDate: '2024-08-07', advice: 'サンプルアドバイス1' },
//         { id: 2, startDate: '2024-08-08', endDate: '2024-08-14', advice: 'サンプルアドバイス2' },
//       ]);
//     };
//     fetchSavedAdvices();
//   }, []);

//   const handleGenerateAdvice = async () => {
//     setNewAdvice(
//       'これは新しく生成されたアドバイスのサンプルです。期間: ' + startDate + ' から ' + endDate,
//     );
//   };

//   const handleSaveAdvice = async () => {
//     setSavedAdvices([
//       ...savedAdvices,
//       {
//         id: savedAdvices.length + 1,
//         startDate,
//         endDate,
//         advice: newAdvice,
//       },
//     ]);
//     setNewAdvice('');
//     setStartDate('');
//     setEndDate('');
//   };

//   const handleLoginLogout = () => {
//     setIsLoggedIn(!isLoggedIn);
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 text-gray-800">
//       <aside className="w-full lg:w-64 bg-[#003366] text-white p-6 flex flex-col">
//         <div className="text-3xl font-bold mb-8 flex items-center justify-center">
//           <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-13" />
//         </div>
//         <nav className="flex-1">
//           <ul className="space-y-6">
//             <li>
//               <Link href="/employee-list" className="hover:underline">
//                 社員一覧
//               </Link>
//             </li>
//             <li>
//               <Link href="/" className="hover:underline">
//                 ホームへ戻る
//               </Link>
//             </li>
//           </ul>
//         </nav>
//         <button
//           className="bg-[#66B2FF] text-white px-4 py-2 rounded border border-black font-bold hover:bg-blue-500 transition-colors duration-300 mt-auto"
//           onClick={handleLoginLogout}
//         >
//           {isLoggedIn ? 'ログアウト' : 'ログイン'}
//         </button>
//       </aside>

//       <main className="flex-1 p-6 lg:p-10 bg-white shadow-lg rounded-lg">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="border rounded-lg p-4 shadow" style={{ backgroundColor: '#E0ECF8' }}>
//             <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-[#003366]">
//               保存済みアドバイス履歴
//             </h2>
//             <ul className="space-y-4">
//               {savedAdvices.map((advice) => (
//                 <li
//                   key={advice.id}
//                   className="border p-4 rounded-lg shadow flex justify-between items-center bg-white hover:bg-gray-100 transition-colors duration-300"
//                   onClick={() => setSelectedAdvice(advice)}
//                 >
//                   <span>
//                     {advice.startDate} ~ {advice.endDate}
//                   </span>
//                   <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300">
//                     詳細を見る
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             {selectedAdvice && (
//               <div className="mt-6 bg-white p-4 rounded-lg shadow">
//                 <h3 className="text-xl font-semibold mb-2">選択されたアドバイス</h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   期間: {selectedAdvice.startDate} ~ {selectedAdvice.endDate}
//                 </p>
//                 <p className="whitespace-pre-wrap">{selectedAdvice.advice}</p>
//                 <button
//                   onClick={() => setSelectedAdvice(null)}
//                   className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
//                 >
//                   閉じる
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="border rounded-lg p-4 shadow" style={{ backgroundColor: '#E0ECF8' }}>
//             <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-[#003366]">
//               新規1on1アドバイス生成
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-2 text-sm font-medium">開始日:</label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 text-sm font-medium">終了日:</label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//             <button
//               onClick={handleGenerateAdvice}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-300"
//             >
//               アドバイス生成
//             </button>
//             {newAdvice && (
//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold mb-2">生成されたアドバイス:</h3>
//                 <p className="whitespace-pre-wrap bg-white p-4 rounded">{newAdvice}</p>
//                 <button
//                   onClick={handleSaveAdvice}
//                   className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors duration-300"
//                 >
//                   アドバイスを保存
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetAllSavedAdvices } from '../../../hooks/fetch_llm/useGetAllSevedAdvices';
import { useGetSavedAdvice } from '../../../hooks/fetch_llm/useGetSavedAdvice';
import { useSaveAdvice } from '../../../hooks/fetch_llm/useSaveAdvice';
import useOneOnOneAdvice from '../../../hooks/useOneOnOneAdvice';

interface Advice {
  id: number;
  startDate: string;
  endDate: string;
  advice: string;
}

interface SavedAdvice {
  id: number;
  employee_id: string;
  advices: string;
  created_at: string;
}

interface EmployeeInfo {
  department: string;
  email: string;
  id: string;
  name: string;
  project: string;
  role: string;
  slack_user_id: string;
}

export default function OneOnOneAdvicePage() {
  const params = useParams();
  const slack_user_id = params.slack_user_id as string;

  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newAdvice, setNewAdvice] = useState('');
  const [savedAdvices, setSavedAdvices] = useState<Advice[]>([]);
  const [selectedAdvice, setSelectedAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    adviceData,
    loading: generatingAdvice,
    error: adviceError,
    fetchAdvice,
  } = useOneOnOneAdvice();
  const saveAdvice = useSaveAdvice();
  const {
    allSavedAdvices,
    loading: fetchingAllAdvices,
    error: allAdvicesError,
  } = useGetAllSavedAdvices(slack_user_id);
  const { savedAdvice } = useGetSavedAdvice(slack_user_id, new Date());

  useEffect(() => {
    async function fetchEmployeeData() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/client/selected_employee/${slack_user_id}/`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch employee data: ${response.status}`);
        }
        const data = await response.json();
        setEmployeeInfo(data[0]); // Assuming the employee info is the first item in the array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (slack_user_id) {
      fetchEmployeeData();
    }
  }, [slack_user_id]);

  useEffect(() => {
    if (allSavedAdvices) {
      setSavedAdvices(
        allSavedAdvices.map((advice: SavedAdvice) => ({
          id: advice.id,
          startDate: advice.created_at,
          endDate: advice.created_at,
          advice: advice.advices,
        })),
      );
    }
  }, [allSavedAdvices]);

  const handleGenerateAdvice = async () => {
    if (!startDate || !endDate) return;
    await fetchAdvice(slack_user_id, startDate, endDate);
    if (adviceData) {
      setNewAdvice(adviceData);
    }
  };

  const handleSaveAdvice = async () => {
    if (!newAdvice) return;
    try {
      await saveAdvice(slack_user_id, newAdvice);
      // 保存後、全てのアドバイスを再取得
      const updatedAdvices = await useGetAllSavedAdvices(slack_user_id);
      if (updatedAdvices.allSavedAdvices) {
        setSavedAdvices(
          updatedAdvices.allSavedAdvices.map((advice: SavedAdvice) => ({
            id: advice.id,
            startDate: advice.created_at,
            endDate: advice.created_at,
            advice: advice.advices,
          })),
        );
      }
      setNewAdvice('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Failed to save advice:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employeeInfo) {
    return <div>従業員データが見つかりません</div>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#003366] text-white p-6 flex flex-col">
        <div className="text-3xl font-bold mb-8">
          <img src="/image/SyncEra(blue_white).png" alt="SyncEra Logo" className="h-13" />
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                href="/employee-list"
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
                社員一覧
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block text-lg text-white hover:text-white hover:underline transition-colors duration-300"
              >
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
            {employeeInfo.name}の1on1アドバイス
          </h2>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2 text-[#003366]">社員情報</h3>
            <p className="text-[#333333]">
              <strong>部署:</strong> {employeeInfo.department}
            </p>
            <p className="text-[#333333]">
              <strong>プロジェクト:</strong> {employeeInfo.project}
            </p>
            <p className="text-[#333333]">
              <strong>役職:</strong> {employeeInfo.role}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 shadow" style={{ backgroundColor: '#E0ECF8' }}>
              <h3 className="text-2xl font-semibold mb-4 text-[#003366]">保存済みアドバイス履歴</h3>
              {fetchingAllAdvices ? (
                <p>Loading...</p>
              ) : allAdvicesError ? (
                <p>Error: {allAdvicesError.message}</p>
              ) : (
                <ul className="space-y-4">
                  {savedAdvices.map((advice: Advice) => (
                    <li
                      key={advice.id}
                      className="border p-4 rounded-lg shadow flex justify-between items-center bg-white hover:bg-gray-100 transition-colors duration-300"
                      onClick={() => setSelectedAdvice(advice)}
                    >
                      <span>
                        {new Date(advice.startDate).toLocaleDateString()} ~{' '}
                        {new Date(advice.endDate).toLocaleDateString()}
                      </span>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300">
                        詳細を見る
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selectedAdvice && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow">
                  <h4 className="text-xl font-semibold mb-2">選択されたアドバイス</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    期間: {new Date(selectedAdvice.startDate).toLocaleDateString()} ~{' '}
                    {new Date(selectedAdvice.endDate).toLocaleDateString()}
                  </p>
                  <p className="whitespace-pre-wrap">{selectedAdvice.advice}</p>
                  <button
                    onClick={() => setSelectedAdvice(null)}
                    className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    閉じる
                  </button>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 shadow" style={{ backgroundColor: '#E0ECF8' }}>
              <h3 className="text-2xl font-semibold mb-4 text-[#003366]">新規1on1アドバイス生成</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">開始日:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">終了日:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateAdvice}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-300"
                disabled={generatingAdvice}
              >
                {generatingAdvice ? 'アドバイス生成中...' : 'アドバイス生成'}
              </button>
              {adviceError && <p className="text-red-500 mt-2">{adviceError}</p>}
              {newAdvice && (
                <div className="mt-6">
                  <h4 className="text-xl font-semibold mb-2">生成されたアドバイス:</h4>
                  <p className="whitespace-pre-wrap bg-white p-4 rounded">{newAdvice}</p>
                  <button
                    onClick={handleSaveAdvice}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors duration-300"
                  >
                    アドバイスを保存
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
