from fastapi import APIRouter

router = APIRouter()

# 日報が投稿された時　`POST /post_daily_report`　`by Slack`
@router.post("/post_daily_report/")
# Slack APIからdaily_reportチャンネルの投稿情報を取得し、Postgresに保存する関数
def save_daily_report():
    # データベースセッションを確立
    session = get_db()

    conversation_history = []
    channel_id = os.getenv("DAILY_REPORT_CHANNEL_ID")

    try:
        # conversations.historyメソッドを使用してチャンネルのメッセージを取得
        result = client.conversations_history(channel=channel_id)
        conversation_history = result["messages"]

        # 結果をログに出力
        logger.info("{} messages found in {}".format(len(conversation_history), channel_id))

        for message in conversation_history:
            ts = message.get('ts')
            user_id = message.get('user')
            text = message.get('text')
            thread_ts = message.get('thread_ts')
            

            # ユーザー情報をデータベースに挿入
            message_record = Message(ts=ts, user_id=user_id, text=text, thread_ts=thread_ts, parent_message_id=parent_message_id)
            session.merge(message_record)  # 存在する場合は更新し、存在しない場合は挿入
        
        # コミットして変更を保存
        session.commit()

    except SlackApiError as e:
        logger.error("Error fetching users: {}".format(e))
        return {"error": str(e)}
    
    except Exception as e:
        logger.error("Database error: {}".format(e))
        session.rollback()  # エラーが発生した場合、ロールバック

    finally:
        session.close()  # 最後にセッションを閉じる

    return {"status": "success"}



# timesに投稿があった時 `POST /post_times` 　`by Slack`
@router.post("/post_times")
def save_times_tweet():
    return "処理なども全て未実装、随時ここは追記していく"

# キャリアアンケート実施のリクエストがあった時　GET or POST /execution_career_survey by Slack
@router.get("/execution_career_survey") # または @router.post("/execution_career_survey")
def execution_career_survey():
    return "処理なども全て未実装、随時ここは追記していく"

# キャリアアンケートの回答が提出された時 POST /post_career_survey　by Slack
@router.post("/post_career_survey")
def save_career_survey():
    return "処理なども全て未実装、随時ここは追記していく"

# 以下はPOSTリクエストのみを受け付けているエンドポイントが正常に解説されているか確認するためのコード: いずれも期待通りの動作確認OK
@router.get("/post_daily_report/")
def check_endpoint():
    return "/post_daily_report エンドポイントOKだよ!!"

@router.get("/post_times/")
def check_endpoint():
    return "/post_times エンドポイントOKだよ!!"

@router.get("/post_career_survey/")
def check_endpoint():
    return "/post_career_survey エンドポイントOKだよ!!"