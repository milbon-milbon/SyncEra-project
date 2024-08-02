# ベースイメージとして Node 18 を使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# パッケージ定義ファイルをコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Next.js の開発サーバーを起動
CMD ["npm", "run", "dev"]
