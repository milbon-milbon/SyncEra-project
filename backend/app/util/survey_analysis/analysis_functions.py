#import pandas as pd
from sqlalchemy import create_engine
from .career_analysis import analysis_df
import json
from datetime import date

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
    print(decoded_json_str)
    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)


# 指定期間の回答を抽出_____使用しない_____
# def filtered_by_period_analysis(start_date: date, end_date: date):
#     filtered_by_period_df = analysis_df[(analysis_df['date'] >= start_date) & (analysis_df['date'] <= end_date)]
#     print(filtered_by_period_df)
#     #続いてJSON形式に変換してreturnする
#     return filtered_by_period_df.to_json(orient='records', date_format='iso')


# 特定の日付の回答を抽出_____使用しない_____
# def filtered_by_date_analysis(date: date): #YYYY-MM-DD形式
#     filtered_by_date_df = analysis_df[analysis_df['date'] == date]
#     print(filtered_by_date_df)
#     #続いてJSON形式に変換してreturnする
#     return filtered_by_date_df.to_json(orient='records', date_format='iso')


# 特定の日付とユーザーIDを指定して回答抽出_____単回の結果表示に使用する_____
def filtered_by_user_and_date(slack_user_id: str, date: date): #YYYY-MM-DD形式
    filtered_by_user_and_date_df = analysis_df[
        (analysis_df['date'] == date) &
        (analysis_df['slack_user_id'] == slack_user_id)
    ]
    json_str = filtered_by_user_and_date_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    print(decoded_json_str)
    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)

# 特定ユーザーの最新とそのひとつ前の回答を抽出_____前回と最新の結果の差分表示に使用する_____
def latest_two_responses_by_user(slack_user_id: str):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の2件を抽出
    latest_two_df = user_df_sorted.head(2)
    json_str = latest_two_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    print(decoded_json_str)
    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)
    

# 特定ユーザーの指定した回数分の回答を抽出_____回答結果の傾向分析の表示に使用する_____
def selected_period_responses_by_user(slack_user_id: str, num_of_times: int):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の2件を抽出
    latest_months_df = user_df_sorted.head(num_of_times)
    json_str = latest_months_df.to_json(orient='records', date_format='iso')
    decoded_json_str = json.loads(json_str)
    print(decoded_json_str)
    return json.dumps(decoded_json_str, ensure_ascii=False, indent=2)

