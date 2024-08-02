# ベースイメージとして Python 3.10 を使用
FROM python:3.10

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txt をコピーして依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# Uvicorn サーバーを起動（ホットリロード付き）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
