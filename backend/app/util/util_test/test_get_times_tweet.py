from datetime import date
from app.util.get_times_tweet import get_times_tweet  # 正しいモジュールパスに変更してください

# 引数の設定
user_id = "slack_user_sample_1"
start_date = date(2024, 8, 1)
end_date = date(2024, 8, 6)

# 関数の呼び出し
results = get_times_tweet(user_id, start_date, end_date)

# 結果の出力
for result in results:
    print(result)
