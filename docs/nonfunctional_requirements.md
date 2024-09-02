# 非機能要件設計書

| 非機能要件分類                   | 要件詳細                        | 設計・対策                          | 備考                          |
| -------------------------------- | ------------------------------- | ----------------------------------- | ----------------------------- |
| **運用設計**                     |                                 |                                     |                               |
| ログ管理                         | 日次でログローテーション        | ログのアーカイブ、一定期間保持      | Google Cloud Logging          |
| サーバー状態モニタリング         | CPU、メモリ、ディスク使用率監視 | Monitoring のアラート設定           | Google cloud Monitoring       |
| 運用コスト                       | 月ごとの使用量レポート          | 月次での予算確認、費用対策          | Google Cloud Billing          |
| **性能設計**                     |                                 |                                     |                               |
| 性能要件                         | レスポンスタイム 300ms 以下     | 測定方法：負荷テスト                | 8/23 テストコード実装: JMeter |
| 負荷テスト                       | テストシナリオ作成              | JMeter, Gatling                     | 同上                          |
| キャッシュ設計                   | Redis を用いたキャッシュ        | 有効期限設定・破棄タイミング管理    | Redis                         |
| キャリアアンケート質問キャッシュ |
| DB パフォーマンス                | インデックス・クエリ最適化      | パフォーマンスモニタリング          | Google Cloud SQL              |
| Query Insights                   |
| **ログ設計**                     |                                 |                                     |                               |
| ログレベル管理                   | INFO, WARN, ERROR 制御          | 環境変数でログレベル管理            | Google Cloud Logging          |
| トレーサビリティ                 | 一意の ID 付与                  | JSON フォーマットで一貫性           | Google Cloud Logging API      |
| **可用性設計**                   |                                 |                                     |                               |
| サーバー稼働状況                 | リアルタイム監視                | Monitoring のアラートポリシーを設定 | Google cloud Monitoring       |
| 単一障害点                       | サーバー冗長化                  | ロードバランサー                    | Google Cloud Run              |
| バックアップ                     | 定期的な DB バックアップ        | リージョン間保管                    | Google Cloud SQL              |
| **セキュリティ設計**             |                                 |                                     |                               |
| 認証と認可                       | RBAC、最小権限の原則            | アクセス制御                        | Firebase Authentication       |
| クレデンシャル管理               | 環境変数で管理                  | パスワードはハッシュ化              | Firebase Authentication       |
| 推測困難な ID                    | UUID 使用                       | 推測困難な値設計                    | Firebase Authentication       |
