import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# DBのResponseテーブルとQuestionテーブルを材料に、アンケート回答の分析用テーブルを出力するロジック(Pandasの使用)
# 使用用途 : LLMへのRAGのひとつにする(キャリアアンケートの結果分析は最終的にLLMによって文字での出力が前提)
load_dotenv()
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("有効なDATABASE_URLがみつかりません")


# SQLAlchemyのエンジンを使用してデータベースからデータを読み込む
engine = create_engine(database_url)  # データベースURLを指定

# データベースからテーブルを読み込む
questions_df = pd.read_sql_table('questions', engine)
responses_df = pd.read_sql_table('responses', engine)

# テーブルを結合
merged_df = pd.merge(responses_df, questions_df, left_on='question_id', right_on='id', suffixes=('_response', '_question'))

# answer_textを選択
def get_answer_text(row):
    if row['answer'] == 'A':
        return row['choice_a']
    elif row['answer'] == 'B':
        return row['choice_b']
    elif row['answer'] == 'C':
        return row['choice_c']
    elif row['answer'] == 'D':
        return row['choice_d']
    else:
        return None

merged_df['answer_text'] = merged_df.apply(get_answer_text, axis=1)

# 日付の抽出
merged_df['date'] = pd.to_datetime(merged_df['created_at']).dt.date

# 必要なカラムのみ選択
analysis_df = merged_df[['id_response', 'slack_user_id', 'question_id', 'question_text', 'answer', 'answer_text', 'free_text', 'date']]

#　すべてのuserなどが含まれた、分析用のanalysisテーブルが作成されている
print(analysis_df.head())