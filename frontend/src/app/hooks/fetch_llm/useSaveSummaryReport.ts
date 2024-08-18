// 出力した日報+timesサマリーをデータベースに保存する(POST)

'use client';

import { useEffect, useState } from 'react';

interface SummaryReport {
    // 型定義が必要なら定義する
    slack_user_id: string
    summary: string
}

export const useSaveSummaryReport = async(slackUserId: string, summary: string): Promise<void> => {
    const summaryReportData: SummaryReport = {
        slack_user_id: slackUserId,
        summary: summary
    }

    console.log(`◆保存するオブジェクト: ${summaryReportData}`)

    try{
        const response = await fetch('http://localhost:8000/client/save_summary_report/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(summaryReportData)
        });

        if(!response.ok){
            throw new Error(`failed to save summary report: ${response.statusText}`)
        }

        // responseのstatusがOKなら
        console.log(`summary report just saved.`)
    }
    catch(error){
        console.error(`Error:`, error)
    }
};

// ページコンポーネントで呼び出すときには...

// import React, { useState } from 'react';
// import { useSaveSummaryReport } from './useSaveSummaryReport';  // 適切なパスでインポート

// const PageComponent = () => {
//     const [employeeId, setEmployeeId] = useState('12345');
//     const [summary, setSummary] = useState('This is an advice text.');

//     const handleSaveClick = () => {
//         useSaveSummaryReport(employeeId, summary); //適切に関数呼び出しができるようにしている
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
//                 value={summary}
//                 onChange={(e) => setSummary(e.target.value)}
//                 placeholder="Enter your advice"
//             />
//             <button onClick={handleSaveClick}>保存</button>
//         </div>
//     );
// };

// export default PageComponent;
