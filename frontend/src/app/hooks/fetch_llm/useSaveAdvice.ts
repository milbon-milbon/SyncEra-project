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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/client/save_advice/`, 
            {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(adviceData)
            }
        );

        if(!response.ok){
            throw new Error(`failed to save advice: ${response.statusText}`)
        }
    }
    catch(error){
        console.error(`Error`)
    }
};

