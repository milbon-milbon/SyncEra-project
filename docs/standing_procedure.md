## 全て統合した compose を立ち上げる手順

### 1）syncera/frontend にも [ **.env** ] を配置する (コピーコマンド使用可能)

```jsx
cp .env frontend/
```

---

### ２）firebase 関連の事前設定 (コンテナ立ち上げ前、ルートディレクトリで各種コマンド実行)

- 必要なフォルダとファイルを作成する（すでにあれば skip で OK）
  ```jsx
  mkdir backend/secrets
  touch backend/secrets/firebase-adminsdk.json
  touch functions/service-account.json
  ```
- ファイルの中身

  ```jsx
  // backend/secrets/firebase-adminadk.json
  // functions/service-account.json
  ```

- docker image の build を先行して実施
  ```jsx
  docker build -t firebase_functions functions
  ```

---

### ３）自動 migration,seeding のための事前準備

- db コンテナだけを立ち上げる
  ```jsx
  docker compose up db
  ```
- db コンテナの中に入る
  ```jsx
  docker compose exec -it db psql -U syncera -d postgres
  ```
- 既存のセッションを切断し、データベースを削除、再生成する

  ```jsx

  // 以下は一気に貼り付け
  SELECT pid, pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'syncera_db';

  DROP DATABASE syncera_db;
  CREATE DATABASE syncera_db;
  \q
  ```

- 一度コンテナを止める
  ```jsx
  docker compose down
  ```
- `backend/app/db/migrations/versions`の中身を空っぽにする
- `backend/dockerfile`の **[CMD]** を確認する（開発用 or 本番用）⚠️ 本番環境は sayoko さんのみ使用、他のメンバーは開発用を使用

---

### ４）全ての作業と確認が終わったら、docker compose を立ち上げる

```jsx
docker compose up --build
```

---

### 💡 参考情報） docker 立ち上げ後 : DB が期待通りに作成されているかの確認方法

```python
# dbコンテナに入る
docker compose exec -it db psql -U syncera -d syncera_db

# テーブル一覧表示
\dt

# テーブルの詳細確認
\d テーブル名

# データの確認
SELECT * FROM <table_name>;
SELECT * FROM times_tweet;
SELECT * FROM daily_report;
SELECT * FROM times_list;
SELECT * FROM employee;
SELECT * FROM questions;
SELECT * FROM responses;
SELECT * FROM slack_user_info;

# コンテナから出る
\q

```

- 自動化の導入時の変更点(8/9 時点)
  - db 整備自動化のために、alembic.ini の場所が変わっています（app/db → backend/ )
    - 伴って alembic.ini の script_location を migrations→ app/db/migrations に変更しています
    - seeding 自動化のために、app/db/seed の中のファイル名が変わっています
      - seed_dev.py : くーみんさん、みきこさん、めめ向けのモックデータの seeding 用
      - seed_product.py : 本番、さよこさん用 リアルな ID を用いて employee テーブル、times_list テーブルに seeding
  - models.py 　の employee テーブル: slack_user_id に unique=True を追加しています
- 困ったら
    <aside>
    💡 日報データや、つぶやきの投稿がみつからない、と言われたら・・・
    URLの**end_date=….** 部分を変えて、リロードしてみてください。
    
    例）[`http://localhost:3000/employee-list/summaried_report/sample_1?start_date=2024-08-01&end_date=2024-08-10`](http://localhost:3000/employee-list/summaried_report/sample_1?start_date=2024-08-01&end_date=2024-08-10)
    
    サンプルデータの投稿日時はseedingをした日時に準ずるため、デフォルトの2024/8/1 ~ 2024/8/7 には投稿が存在せず、end_date をseedingした日とかにすると出てくるかもしれません
    </aside>
