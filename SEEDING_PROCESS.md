seedingのプロセス

```
docker compose exec -it backend /bin/bash
```

```
cd app/db
```

```
export PYTHONPATH=/app
```

```
python seed_1.py
```

ここでまずは
`slack_user_infoテーブル`と`daily_reportテーブル`のseedingが完了する。

```
python seed_2.py
```
```
python seed_3.py
```

これで、残りのテーブルのseedingが完了する。
seedingできたかを確認するには

```
docker compose exec -it db psql -U syncera -d syncera_db
```

```
SELECT * FROM テーブル名;
```