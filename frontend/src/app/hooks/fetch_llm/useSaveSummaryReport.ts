// 出力した日報+timesサマリーをデータベースに保存する(POST)

'use client';

interface SummaryReport {
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
