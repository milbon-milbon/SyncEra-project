import pandas as pd
from sqlalchemy import create_engine

# DBのResponseテーブルとQuestionテーブルを材料に、アンケート回答の分析用テーブルを出力するロジック(Pandasの使用)
# 使用用途 : LLMへのRAGのひとつにする(キャリアアンケートの結果分析は最終的にLLMによって文字での出力が前提)

# SQLAlchemyのエンジンを使用してデータベースからデータを読み込む
engine = create_engine('ここにPostgreSQLのURL入れ込む')  # データベースURLを指定

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

print(analysis_df.head())

#_____SQL_____
# SELECT 
#     r.id,
#     r.slack_user_id,
#     r.question_id,
#     q.question_text,
#     r.answer,
#     CASE
#         WHEN r.answer = 'A' THEN q.choice_a
#         WHEN r.answer = 'B' THEN q.choice_b
#         WHEN r.answer = 'C' THEN q.choice_c
#         WHEN r.answer = 'D' THEN q.choice_d
#         ELSE NULL
#     END AS answer_text,
#     r.free_text,
#     DATE(r.created_at) AS date
# FROM 
#     responses r
# JOIN 
#     questions q ON r.question_id = q.id;
