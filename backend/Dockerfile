FROM python:3.10

# 作業ディレクトリを設定
WORKDIR /app

# PYTHONPATH 環境変数を設定
ENV PYTHONPATH=/app

# requirements.txt をコピーして依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# 開発環境用
CMD ["bash", "-c",  "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && python app/db/seed/seed_dev_2.py && python app/db/seed/seed_sample_response.py && python app/util/survey_analysis/save_analysis_result.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# 本番環境用
# CMD ["bash", "-c", "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && python app/util/slack_api/post_slack_message.py && python app/db/seed/seed_product.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
