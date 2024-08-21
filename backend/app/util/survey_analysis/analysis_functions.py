from .create_analysis_table import analysis_df
import json
from datetime import date, datetime, timedelta
import os
import logging

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

#　_____返り値は全て共通して以下の形式_____
# [
#     {
#         "id_response": 1,
#         "slack_user_id": "U12345",
#         "question_id": 101,
#         "question_text": "What is your career goal?",
#         "answer": "A",
#         "answer_text": "To become a manager",
#         "free_text": "I aim to improve my leadership skills.",
#         "date": "2024-08-01"
#     },
#     ...
# ]


# 特定ユーザーの回答を抽出_____一覧表示に使用______
def filtered_by_slack_user_id_analysis(slack_user_id: str):
    filtered_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    json_str = filtered_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    logger.debug(decoded_json_str)
    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)

# 特定の日付とユーザーIDを指定して回答抽出_____単回の結果表示に使用する_____
def filtered_by_user_and_date(slack_user_id: str, date: date): #YYYY-MM-DD形式
    filtered_by_user_and_date_df = analysis_df[
        (analysis_df['date'] == date) &
        (analysis_df['slack_user_id'] == slack_user_id)
    ]
    json_str = filtered_by_user_and_date_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    logger.debug(decoded_json_str)
    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)

# 最新の回答だけを抽出
def latest_response_by_user(slack_user_id: str):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の日付を取得
    latest_date = user_df_sorted['date'].iloc[0]

    # 最新の日付を持つ要素をフィルタリング
    filtered_df = user_df_sorted[user_df_sorted['date'] == latest_date]


    # JSON形式に変換して出力
    json_str = filtered_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    logger.debug(decoded_json_str)

    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)

# 特定ユーザーの最新とそのひとつ前の回答を抽出_____前回と最新の結果の差分表示に使用する_____
def latest_two_responses_by_user(slack_user_id: str):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の日付とその一つ前の日付を取得
    unique_dates = user_df_sorted['date'].unique()

    if len(unique_dates) >= 2:
        latest_date = unique_dates[0]
        previous_date = unique_dates[1]

        # 最新の日付とその一つ前の日付を持つ要素をフィルタリング
        filtered_df = user_df_sorted[
            (user_df_sorted['date'] == latest_date) |
            (user_df_sorted['date'] == previous_date)
        ]
    else:
        # 日付が1つしかない場合、その日付の要素のみを返す
        filtered_df = user_df_sorted

    # JSON形式に変換して出力
    json_str = filtered_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    logger.debug(decoded_json_str)

    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)
    

# 特定ユーザーの指定した回数分の回答を抽出_____回答結果の傾向分析の表示に使用する_____
# あるユーザーの直近1年分のレスポンスを抽出
def latest_responses_by_user_in_past_year(slack_user_id: str):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の日付を基準として過去1年分の日付を取得
    one_year_ago = datetime.now().date() - timedelta(days=365)
    user_df_filtered = user_df_sorted[user_df_sorted['date'] >= one_year_ago]

    # ユニークな日付を取得
    unique_dates = user_df_filtered['date'].unique()

    # 直近の4つの日付を取得(アンケートは３ヶ月おきに実施されている前提で４回分=1年分)
    if len(unique_dates) >= 4:
        latest_dates = unique_dates[:4]
    else:
        latest_dates = unique_dates

    # 直近の4つの日付に該当する要素をフィルタリング
    filtered_df = user_df_filtered[user_df_filtered['date'].isin(latest_dates)]

    # JSON形式に変換して出力
    json_str = filtered_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    logger.debug(decoded_json_str)

    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)
