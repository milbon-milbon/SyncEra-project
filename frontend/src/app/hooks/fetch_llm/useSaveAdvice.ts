// 出力した1on1アドバイスをデータベースに保存する(POST)

'use client';

interface Advice {
    slack_user_id: string
    advices: string
}

export const useSaveAdvice = async(slackUserId: string, advice: string): Promise<void> => {
    const adviceData: Advice = {
        slack_user_id: slackUserId,
        advices: advice
    }

    try{
        const response = await fetch('http://localhost:8000/client/save_advice/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(adviceData)
        });

        if(!response.ok){
            throw new Error(`failed to save advice: ${response.statusText}`)
        }

        // responseのstatusがOKなら
        console.log(`advice just saved.`)
    }
    catch(error){
        console.error(`Error:`, error)
    }
};

