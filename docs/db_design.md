# データベース構造

このドキュメントでは、データベースのテーブル構造とそのリレーションシップについて説明します。

## テーブル

### `employee`

従業員に関する情報を保存するテーブルです。

- **id**: UUID 型、プライマリキー
- **name**: 文字列型（最大100文字）、従業員の名前
- **email**: 文字列型（最大100文字）、従業員のメールアドレス
- **department**: 文字列型（最大100文字）、従業員の部署
- **role**: 文字列型（最大100文字）、従業員の役職
- **project**: 文字列型（最大100文字）、従業員のプロジェクト
- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照、ユニーク制約

**リレーションシップ**:
- `slack_user_info` テーブルと `one-to-one` のリレーションシップ
- `user_response` テーブルと `one-to-many` のリレーションシップ

### `slack_user_info`

Slack ユーザーの情報を保存するテーブルです。

- **id**: 文字列型（最大100文字）、プライマリキー
- **name**: 文字列型（最大100文字）、Slack ユーザーの名前
- **real_name**: 文字列型（最大100文字）、Slack ユーザーの本名
- **image_512**: 文字列型、Slack ユーザーのプロフィール画像 URL

**リレーションシップ**:
- `employee` テーブルと `one-to-many` のリレーションシップ
- `analysis_result` テーブルと `one-to-many` のリレーションシップ
- `summarize_history` テーブルと `one-to-many` のリレーションシップ
- `advices_history` テーブルと `one-to-many` のリレーションシップ

### `daily_report`

日々のレポートを保存するテーブルです。

- **id**: 整数型、プライマリキー、自動インクリメント
- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照
- **text**: テキスト型、レポートの内容
- **ts**: 浮動小数点型、タイムスタンプ
- **created_at**: タイムスタンプ型、レポート作成日時

### `times_tweet`

特定のチャンネルに投稿されたツイートを保存するテーブルです。

- **id**: 整数型、プライマリキー、自動インクリメント
- **channel_id**: 文字列型、`times_list` テーブルの `channel_id` を外部キーとして参照
- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照
- **text**: テキスト型、ツイートの内容
- **ts**: 浮動小数点型、タイムスタンプ
- **thread_ts**: 浮動小数点型、スレッドのタイムスタンプ（オプション）
- **parent_user_id**: 文字列型、親ユーザー ID（オプション）
- **created_at**: タイムスタンプ型、ツイート作成日時

### `times_list`

チャンネル情報を保存するテーブルです。

- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照
- **channel_name**: 文字列型（最大100文字）、チャンネルの名前
- **channel_id**: 文字列型（最大100文字）、プライマリキー

### `contact_form`

コンタクトフォームの情報を保存するテーブルです。

- **id**: 整数型、プライマリキー、自動インクリメント
- **company_name**: 文字列型（最大100文字）、会社名
- **department**: 文字列型（最大100文字）、部署名（オプション）
- **name**: 文字列型（最大100文字）、担当者の名前
- **email**: 文字列型（最大100文字）、担当者のメールアドレス
- **message**: テキスト型、メッセージ内容
- **created_at**: タイムスタンプ型、フォーム送信日時

### `summarize_history`

サマリー履歴を保存するテーブルです。

- **id**: 整数型、プライマリキー、自動インクリメント
- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照
- **summary**: 文字列型、サマリー内容
- **created_at**: タイムスタンプ型、サマリー作成日時

### `advices_history`

アドバイス履歴を保存するテーブルです。

- **id**: 整数型、プライマリキー、自動インクリメント
- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照
- **advices**: 文字列型、アドバイス内容
- **created_at**: タイムスタンプ型、アドバイス作成日時

### `questions`

アンケートの質問を保存するテーブルです。

- **id**: 整数型、プライマリキー
- **question_text**: 文字列型、質問内容
- **choice_a**: 文字列型、選択肢 A（オプション）
- **choice_b**: 文字列型、選択肢 B（オプション）
- **choice_c**: 文字列型、選択肢 C（オプション）
- **choice_d**: 文字列型、選択肢 D（オプション）
- **next_question_a_id**: 整数型、次の質問 ID（選択肢 A に対応）
- **next_question_b_id**: 整数型、次の質問 ID（選択肢 B に対応）
- **next_question_c_id**: 整数型、次の質問 ID（選択肢 C に対応）
- **next_question_d_id**: 整数型、次の質問 ID（選択肢 D に対応）

### `responses`

ユーザーの回答を保存するテーブルです。

- **id**: 整数型、プライマリキー
- **slack_user_id**: 文字列型、`employee` テーブルの `slack_user_id` を外部キーとして参照
- **question_id**: 整数型、`questions` テーブルの `id` を外部キーとして参照
- **answer**: 文字列型、選択肢の回答
- **free_text**: テキスト型、自由記述の回答（オプション）
- **created_at**: タイムスタンプ型、回答作成日時

### `analysis_result`

分析結果を保存するテーブルです。

- **id**: 整数型、プライマリキー、自動インクリメント
- **slack_user_id**: 文字列型、`slack_user_info` テーブルの `id` を外部キーとして参照
- **result**: テキスト型、分析結果
- **created_at**: タイムスタンプ型、分析結果作成日時
