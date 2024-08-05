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
python seed.py
```

ここでまずは
`slack_user_infoテーブル`と`daily_reportテーブル`のseedingが完了する。

```
python seeding_script.py
```

これで、残りのテーブルのseedingが完了する。
employee, times_list, times_tweet, summarize_history, advices_history

seedingを確認するには

```
docker compose exec -it db psql -U syncera -d syncera_db
```

```
SELECT * FROM テーブル名;
```