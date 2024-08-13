import pandas as pd
from sqlalchemy import create_engine
from .career_analysis import analysis_df
import json
from datetime import date

# 特定ユーザーの回答を抽出
def filtered_by_slack_user_id_analysis(slack_user_id: str):
    filtered_by_slack_user_id_df = analysis_df[analysis_df['slack_user_id'] == slack_user_id]
    print(filtered_by_slack_user_id_df)
    #続いてJSON形式に変換してreturnする
    return filtered_by_slack_user_id_df.to_json(orient='records', date_format='iso')

# 指定期間の回答を抽出
def filtered_by_period_analysis(start_date: date, end_date: date):
    filtered_by_period_df = analysis_df[(analysis_df['date'] >= start_date) & (analysis_df['date'] <= end_date)]
    print(filtered_by_period_df)
    #続いてJSON形式に変換してreturnする
    return filtered_by_period_df.to_json(orient='records', date_format='iso')


# 特定の日付の回答を抽出
def filtered_by_date_analysis(date: date): #YYYY-MM-DD形式
    filtered_by_date_df = analysis_df[analysis_df['date'] == date]
    print(filtered_by_date_df)
    #続いてJSON形式に変換してreturnする
    return filtered_by_date_df.to_json(orient='records', date_format='iso')


# 特定の日付とユーザーIDを指定して回答抽出
def filtered_by_user_and_date(slack_user_id: str, date: date): #YYYY-MM-DD形式
    filtered_by_user_and_date_df = analysis_df[
        (analysis_df['date'] == date) &
        (analysis_df['slack_user_id'] == slack_user_id)
    ]
    print(filtered_by_user_and_date_df)
    ##続いてJSON形式に変換してreturnする
    return filtered_by_user_and_date_df.to_json(orient='records', date_format='iso')
