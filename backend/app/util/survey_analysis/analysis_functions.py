#import pandas as pd
from sqlalchemy import create_engine
from .career_analysis import analysis_df
import json
from datetime import date

# 特定ユーザーの回答を抽出_____一覧表示に使用______
def filtered_by_slack_user_id_analysis(slack_user_id: str):
    filtered_by_slack_user_id_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    print(filtered_by_slack_user_id_df)
    #続いてJSON形式に変換してreturnする
    return filtered_by_slack_user_id_df.to_json(orient='records', date_format='iso')

# 指定期間の回答を抽出_____使用しない_____
def filtered_by_period_analysis(start_date: date, end_date: date):
    filtered_by_period_df = analysis_df[(analysis_df['date'] >= start_date) & (analysis_df['date'] <= end_date)]
    print(filtered_by_period_df)
    #続いてJSON形式に変換してreturnする
    return filtered_by_period_df.to_json(orient='records', date_format='iso')


# 特定の日付の回答を抽出_____使用しない_____
def filtered_by_date_analysis(date: date): #YYYY-MM-DD形式
    filtered_by_date_df = analysis_df[analysis_df['date'] == date]
    print(filtered_by_date_df)
    #続いてJSON形式に変換してreturnする
    return filtered_by_date_df.to_json(orient='records', date_format='iso')


# 特定の日付とユーザーIDを指定して回答抽出_____単回の結果表示に使用する_____
def filtered_by_user_and_date(slack_user_id: str, date: date): #YYYY-MM-DD形式
    filtered_by_user_and_date_df = analysis_df[
        (analysis_df['date'] == date) &
        (analysis_df['slack_user_id'] == slack_user_id)
    ]
    print(filtered_by_user_and_date_df)
    ##続いてJSON形式に変換してreturnする
    return filtered_by_user_and_date_df.to_json(orient='records', date_format='iso')

# 特定ユーザーの最新とそのひとつ前の回答を抽出_____前回と最新の結果の差分表示に使用する_____
def latest_two_responses_by_user(slack_user_id: str):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の2件を抽出
    latest_two_df = user_df_sorted.head(2)
    
    print(latest_two_df)
    # 続いてJSON形式に変換してreturnする
    return latest_two_df.to_json(orient='records', date_format='iso')

# 特定ユーザーの指定した回数分の回答を抽出_____回答結果の傾向分析の表示に使用する_____
def selected_period_responses_by_user(slack_user_id: str, num_of_times: int):
    # 特定のユーザーのデータをフィルタリング
    user_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    
    # 日付でソート
    user_df_sorted = user_df.sort_values(by='date', ascending=False)
    
    # 最新の2件を抽出
    latest_months_df = user_df_sorted.head(num_of_times)
    
    print(latest_months_df)
    # 続いてJSON形式に変換してreturnする
    return latest_months_df.to_json(orient='records', date_format='iso')

