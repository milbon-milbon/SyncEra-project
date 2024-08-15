// 出力した1on1アドバイスをデータベースに保存する(POST)

'use client';

interface Advice {
  // 型定義が必要なら定義する
  employee_id: string;
  advice: string;
}

export const useSaveAdvice = async (employeeId: string, advice: string): Promise<void> => {
  const adviceData: Advice = {
    employee_id: employeeId,
    advice: advice,
  };

  try {
    const response = await fetch('http://localhost:8000/client/save_advice/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adviceData),
    });

    if (!response.ok) {
      throw new Error(`failed to save advice: ${response.statusText}`);
    }

    // responseのstatusがOKなら
    console.log(`advice just saved.`);
  } catch (error) {
    console.error(`Error:`, error);
  }
};

// ページコンポーネントで呼び出すときには...

// import React, { useState } from 'react';
// import { useSaveAdvice } from './useSaveAdvice';  // 適切なパスでインポート

// const PageComponent = () => {
//     const [employeeId, setEmployeeId] = useState('12345');
//     const [advice, setAdvice] = useState('This is an advice text.');

//     const handleSaveClick = () => {
//         useSaveAdvice(employeeId, advice); //適切に関数呼び出しができるようにしている
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 value={employeeId}
//                 onChange={(e) => setEmployeeId(e.target.value)}
//                 placeholder="Employee ID"
//             />
//             <textarea
//                 value={advice}
//                 onChange={(e) => setAdvice(e.target.value)}
//                 placeholder="Enter your advice"
//             />
//             <button onClick={handleSaveClick}>保存</button>
//         </div>
//     );
// };

// export default PageComponent;
