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

    try{
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/client/save_summary_report/`, 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(summaryReportData)
            }
        );

        if(!response.ok){
            throw new Error(`failed to save summary report: ${response.statusText}`)
        }
    }
    catch(error){
        console.error(`Error`)
    }
};
