# ベースイメージとして Google Cloud SDK を使用
FROM google/cloud-sdk:latest

# 作業ディレクトリを設定
WORKDIR /workspace/functions

# Node.js と npm のインストール
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Firebase CLI のインストール
RUN npm install -g firebase-tools

# package.jsonとpackage-lock.jsonをコピーして、依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Firebaseエミュレーターを起動
CMD ["firebase", "emulators:start", "--only", "functions"]
