# ベースイメージとして Python 3.10 を使用
FROM python:3.10

# 作業ディレクトリを設定
WORKDIR /app

# PYTHONPATH 環境変数を設定
# いつもやってた 'export PYTHONPATH=/app' の代わりだよ
ENV PYTHONPATH=/app

# requirements.txt をコピーして依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# Uvicorn サーバーを起動（ホットリロード付き）
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# マイグレーションの自動実行とシードデータ投入: くーみん、みきこ、めめ向け
CMD ["bash", "-c",  "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && python app/db/seed/seed_dev.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# マイグレーションの自動実行とシードデータ投入: さよこ、本番向け
# CMD ["bash", "-c", "alembic upgrade head && python app/db/seed/seed_product.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]