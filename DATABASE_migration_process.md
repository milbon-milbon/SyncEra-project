SyncEraメンバーへ

データベースのmigration手順を以下に記載します

1. backendコンテナに入る
    ```
    docker compose exec -it backend /bin/bash
    ```
2. elembic.iniのある階層へ移動する
    ```
    cd app/db
    ```
3. appというパスを認識させる
    ```
    export PYTHONPATH=/app
    ```
4. マイグレーションの作成
    ```
    alembic revision --autogenerate -m "Initial migration, models=employee,slack_user_info,daily_report"
    ```
5. マイグレーションの適用（テーブルの作成）
    ```
    alembic upgrade head
    ```

データベースにテーブルが作成できたかどうかを確認する
1. コンテナに入る
    ```
    docker compose exec -it db psql -U syncera -d syncera_db
    ```
2. テーブル一覧表示
    ```
    \dt
    ```
3. テーブルの詳細確認
    ```
    \d テーブル名
    ```
4. コンテナから出る
    ```
    \q
    ```