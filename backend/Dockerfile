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

# # マイグレーションの自動実行とシードデータ投入: くーみん、みきこ、めめ向け
#_____seedingファイルを 新しい方に変更済: seed_dev.py => seed_dev_2.py_____
#_____めめの作業用に'python app/db/seed/seed_sample_response.py'を追加している_____
    # seed_sample_response.py = アンケートの回答に見立てたサンプルデータ
    # save_analysis_result.py = アンケート回答回答後のLLMの分析結果をDB保存するロジックの実行（予定ではここをSlackでのアンケート回答終了時に自動実行させる）
#CMD ["bash", "-c",  "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && python app/db/seed/seed_dev_2.py && python app/db/seed/seed_sample_response.py && python app/util/survey_analysis/save_analysis_result.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
# CMD ["bash", "-c",  "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && python app/db/seed/seed_dev_2.py&&python app/db/seed/seed_sample_response.py&&python app/util/survey_analysis/save_analysis_result.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# マイグレーションの自動実行とシードデータ投入: さよこ、本番向け
CMD ["bash", "-c", "alembic revision --autogenerate -m 'Initial migration' && alembic upgrade head && python app/util/slack_api/post_slack_message.py && python app/db/seed/seed_product.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
