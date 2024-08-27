# ![Logo](https://github.com/ms-engineer-bc24-06/SyncEra/blob/dev/docs/img/white_1.png)

お客様のビジネス成長を支援し、新たな価値を共に創造し、課題を解決するためのアプリケーションです。その名前は、さまざまな世代（Era）を同期（Sync）するというコンセプトに由来しています。

## アプリの概要

メンバーの日々の業務内容を要約し、マネージャーや育成担当とメンバーのコミュニケーションを円滑にして、エンゲージメントを向上させるコミュニケーション支援ツールです。

## アプリを作成した目的や背景

上司と部下など、年代や職務の異なる社員同士のコミュニケーションが活性化しにくい問題や、職場でジェネレーションギャップを感じる人は一定数いる現状を把握。多くは仕事への向き合い方やコミュニケーションの取り方にそのギャップを感じ、困った経験があると回答している調査結果などから、SyncEra は、これらの問題を解決し、チームの効率的なコミュニケーションと情報管理を支援することを目的として開発しました。

## メンバーと担当

- mikiko - リーダー、フロント全般
- meme - バックエンド(主に LLM 関連)、データベース、環境構築、テスト
- sayoko - バックエンド(主に SlackAPI 関連)、インフラ
- ku-min - 決済、認証、フロント（左記関連）

## 技術スタック

### フロントエンド

- フレームワーク: Next.js
- 言語: TypeScript
- UI ライブラリ: Tailwind CSS

### バックエンド

- フレームワーク: FastAPI (Python)
- データベース: PostgreSQL(SqlAlchemy)
- キャッシュ: Redis

### その他

- 認証: Firebase
- API: Slack API, Stripe API,OpenAI API
- テスト:Playwrite,JMeter
- 開発環境: Git, Docker
- クラウド: Google Cloud Run

## 技術選定の理由

<details>
  <summary> Next.js & TypeScript (フロントエンド、言語)</summary>

- 類似技術との比較
  | 特徴 | Next.js (App Router) | Next.js (Pages Router) | React |
  | --------------------------- | -------------------------- | ---------------------- | -------------- |
  | 最新の React 機能サポート | 完全サポート | 部分的サポート | 基本サポート |
  | ルーティング | **ファイルベースで直感的** | ファイルベース | 追加設定が必要 |
  | レイアウト管理 | **容易** | やや複雑 | 追加設定が必要 |
  | ローディング状態管理 | **容易** | やや複雑 | 追加設定が必要 |
  | エコシステム | 発展途上 | 成熟 | 非常に成熟 |
  | SSR と SPA の両立 | 容易 | 容易 | 追加設定が必要 |
  | プロジェクト構造 | やや複雑 | シンプル | 自由度が高い |
  | 従来の React 概念との互換性 | やや低い | 高い | 完全互換 |
  | カスタマイズ性 | 高い | 高い | 非常に高い |
  | サードパーティライブラリ | 一部制限あり | 豊富 | 非常に豊富 |
  | 初期構築時間 | 中程度 | 短い | 長い |

      <aside>
      💡 SyncEraでは、以下の理由からNext.js (App Router)を選択：

      Next.js (App Router)は、比較的導入されてまだ数年（Next.js 13 のリリースで導入：2022 年 10 月）と日が浅いが、Next.js (App Router)の直感的にファイルベースのルーティングができることと共通の UI 要素（ヘッダー、フッターなど）を複数のページで再利用などのレイアウト管理が可能なため、将来的にアプリを拡張性した場合にも対応できたり、開発を効率化できると思い選択しました。
      </aside></details>

  <details><summary>
  Python (バックエンド言語)</summary>

- 類似技術との比較
  | 特徴 | Python | TypeScript |
  | ----------------------------------- | ------------------------------------- | ------------------------------ |
  | 読みやすさ | **非常に高い** | 高い |
  | 開発速度 | **速い** | やや遅い |
  | 型安全性 | 動的型付け（型ヒントあり） | 静的型付け |
  | 大規模アプリケーション適性 | 中程度 | 高い |
  | データサイエンス/機械学習ライブラリ | **非常に充実** | 限定的 |
  | データ処理ライブラリ | **豊富（例：Pandas, NumPy）** | 少ない |
  | Web 開発フレームワーク | **豊富（Django, Flask, FastAPI 等）** | 豊富（Angular, React, Vue 等） |
  | 実行環境 | サーバーサイド中心 | ブラウザ・サーバーサイド両方 |
  | コンパイル/インタープリト | インタープリタ言語 | トランスパイル言語 |
  | エコシステム | 非常に大きい | 大きい、成長中 |
    <aside>
    💡 SyncEraでは、以下の理由からPythonを選択：
    
    SyncEraでは、LLM（自然言語処理）やSlackAPIから取得したデータの分析について重要な部分をもつアプリなため、データ処理分野で処理能力の高いPythonが適していると判断しました。
    また、将来的に、ユーザー行動の予測分析などを行うことも想定して、高度な分析や予測機能の実装を拡張できるのではないかと思いPythonと選択しました。
    
    </aside></details>

<details> <summary>FastAPI (バックエンド)</summary>

- 類似技術との比較
  | 特徴 | FastAPI | Flask | Django |
  | -------------------------- | ------------ | ------------------ | ---------- |
  | 非同期処理 | 強力 | 限定的 | 限定的 |
  | パフォーマンス | 高速 | 中程度 | 中程度 |
  | 自動ドキュメント生成 | あり | なし | 限定的 |
  | 軽量性 | 軽量 | 非常に軽量 | 重量級 |
  | 柔軟性 | 高い | 非常に高い | 中程度 |
  | 大規模アプリケーション対応 | 対応可能 | 追加設定が必要 | 優れている |
  | 機能の豊富さ | 中程度 | 最小限 | 非常に豊富 |
  | 学習曲線 | 緩やか | 非常に緩やか | 急 |
  | プロジェクト構造 | 自由度が高い | 自由度が非常に高い | 規約が厳格 |
  | コミュニティサポート | 成長中 | 豊富 | 非常に豊富 |
    <aside>
    💡 SyncEraでは、以下の理由からFastAPIを選択：
    
    FastAPIを選択した主な理由は、主には非同期処理のサポート がある点
    SyncEraでは、Slackからのリアルタイムデータ取得や、クライアントへの非同期レスポンスとOpenAI_APIも使用していて、非同期的な処理が多く必要となるため、FastAPIが、SyncEraのアプリ開発の要件に適していると考え選択しました。
    </aside></details>

<details> <summary>PostgreSQL (データベース)</summary>

- 類似技術との比較
  | 特徴 | PostgreSQL | MySQL | MongoDB (NoSQL) |
  | -------------------- | ---------------------- | ---------------------- | ---------------------- |
  | データモデル | リレーショナル | リレーショナル | ドキュメント指向 |
  | 拡張性 | 高度な拡張性 | 中程度の拡張性 | 高い拡張性 |
  | 複雑なクエリ処理 | 優れている | 標準的 | 制限あり |
  | JSON 対応 | サポート | 部分的サポート | ネイティブサポート |
  | トランザクション処理 | 堅牢 | 堅牢 | 制限あり |
  | データ整合性 | 高 | 高 | 柔軟 |
  | 大規模データ処理 | 優れている | 標準的 | 優れている |
  | スケーラビリティ | 垂直スケーリングに強い | 垂直スケーリングに強い | 水平スケーリングが容易 |
  | コミュニティサポート | 豊富 | 非常に豊富 | 豊富 |
  | 設定・最適化 | やや複雑 | 比較的容易 | 比較的容易 |
  | 非構造化データ処理 | 対応可能 | 制限あり | 非常に適している |
    <aside>
    💡 SyncEraでは、以下の理由からPostgreSQLを選択：
    
    **MongoDBのようなNoSQLソリューションも検討しましたが、SyncEraのデータモデルは比較的構造化されており、リレーショナルデータベースの利点を活かせることと、**Slackからのデータやアンケートの回答など、半構造化データを扱うため、**PostgreSQLのJSON対応により、必要に応じて柔軟なデータ構造も実現できると判断し選択しました**。
    
    </aside></details>

<details> <summary>Redis (キャッシュ)</summary>

- 類似技術との比較
  | 特徴 | Redis | Memcached（メムキャッシュド） |
  | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
  | データ構造 |
  | 扱えるデータの形式や種類 | キー・バリュー（単純な値の保存）、リスト（順序付きのデータ集合）、セット（重複のないデータ集合）、ハッシュ（ブジェクトのような構造化データ）など | キー・バリューのみ |
  | 持続性 | サポート | 非サポート |
  | スケーリング |
  | システムの処理能力を拡張する能力 | クラスタリング対応 |
  | ※複数のサーバーにデータを分散させること。システム全体の処理能力を向上させることができます。 | 一部サポート |
  | 機能 | 多機能 |
  | Redis は基本的なキャッシュ機能以外にも、パブリッシュ/サブスクライブ、トランザクション、Lua スクリプティングなど、多様な機能を提供 | シンプル |
  | 使用例 | セッション管理、キュー管理、リアルタイム分析など | シンプルなデータキャッシュ |
  | データサイズ制限 | **データサイズに制限なし** | 1MB 以下が推奨 |
  | 利用例 | ソーシャルネットワーキングアプリ、e コマースサイト、リアルタイムデータ処理 | ウェブキャッシュ、セッションストア |
  | 開発言語バインディング | 多言語対応（Python, Ruby, Java, C, C++, etc.） | 多言語対応（Python, Ruby, Java, C, C++, etc.） |

<aside>
💡 SyncEraでは、以下の理由からRedisを選択：

Redis はリストやセットなど、複数のデータ構造をサポートしていて、リアルタイムなデータ処理、複雑なデータ構造の扱いが可能なため、SyncEra のアプリ開発で機体している高速なレスポンスとスケーラビリティ（ソフトウェアの拡張性に柔軟に対応）を満たしていると思い選択。そのほか、基本的なキャッシュ機能以外にもトランザクションなどの機能が提供されており、将来的な機能拡張にも柔軟に対応できる点も選択理由です。

</aside></details>

<details> <summary>Firebase (認証)</summary>

- 類似技術との比較
  | 特徴 | Firebase Authentication | Auth0 | AWS Cognito | カスタム実装 |
  | -------------------- | ----------------------- | ------------------------ | -------------- | ------------ |
  | セットアップの容易さ | **非常に簡単** | 簡単 | やや複雑 | 複雑 |
  | 多要素認証 | サポート | 高度なサポート | サポート | 要実装 |
  | ソーシャルログイン | 多数対応 | 多数対応 | 一部対応 | 要実装 |
  | カスタマイズ性 | 中程度 | 高い | 高い | 非常に高い |
  | スケーラビリティ | 高い | 非常に高い | 非常に高い | 要設計 |
  | コスト | **無料枠あり、従量制** | 比較的高価 | 使用量に応じて | 初期コスト高 |
  | クライアント SDK | 充実 | 充実 | 充実 | 要実装 |
  | バックエンド連携 | **Google Cloud 連携** | 多様なインテグレーション | AWS 連携 | 完全自由 |
  | セキュリティ | **高い** | 非常に高い | 高い | 要設計・実装 |
  | ドキュメンテーション | 豊富 | 非常に豊富 | 豊富 | N/A |
    <aside>
    💡 SyncEraでは、以下の理由からFirebaseを選択：
    
    1. SMSやメールの多要素認証やGoogle、Twitterを利用してログインを利用できる機能が標準で提供されて
    2. コストは、初期段階では無料枠で開発が進められ、成長に応じて柔軟にスケールアップ可能
    3. 将来的なバックエンドサービスの拡張を見据えると、Cloud Functions、Cloud Storage、Firestore等との連携が容易でGoogle Cloud Platformの他のサービスとの統合ができ、セキュリティ機能（DDoS保護、暗号化等）が高い。
    4. 将来的にモバイルアプリを開発する際にも同じ認証基盤を利用できる。
    
    SyncEraへの利点: バックエンドサービスの拡張や、データ分析、機械学習機能の追加など、将来的な機能拡張を見据えた際に、統合された環境で開発を進められ、
    
    アプリの現在の要件（迅速な開発、基本的な認証機能）と将来の成長（スケーラビリティ、高度なセキュリティ要件）の両方に対応できると判断し選択。
    
    </aside></details>

<details> <summary>Google Cloud Run (cloud) </summary>

- 類似技術との比較
  | **項目** | **Google Cloud Run** | **AWS (ECS, Lambda, etc.)** |
  | -------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
  | **デプロイの簡便さ** | ◎ 非常に簡単。サーバーレスで自動デプロイが可能。GitHub との連携もシームレス。 | △ 比較的複雑。ECS や Lambda など複数の選択肢があり、設定がやや手間。 |
  | **スケーリング** | ◎ 自動スケーリングがデフォルトで設定されており、トラフィックに応じて自動調整。 | ○ スケーリングは可能だが、設定やチューニングが必要。ECS では Fargate がサーバーレススケーリングを提供。 |
  | **コスト効率** | ◎ アイドル時はゼロインスタンスでコストが発生しない。従量課金制で予測しやすい。 | △ 従量課金だが、スケーリングやリソース追加時にコストが複雑になりがち。 |
  | **学習コスト** | ◎ 低い。シンプルな設定で初心者向けのチュートリアルが豊富。 | △ 高い。多機能で柔軟だが、初心者には学習に時間がかかる可能性あり。 |
  | **Firebase との統合** | ◎ 非常にスムーズ。Google のサービス同士での連携が容易。 | △ AWS は Firebase の代替サービス（Cognito など）を使用。連携に工夫が必要。 |
  | **コンテナサポート** | ○ Docker コンテナをネイティブサポート。コンテナをそのままデプロイ可能。docker-compose は不可。 | △ Docker コンテナを ECS や EKS でサポートしているが、設定が複雑。 |
  | **インフラ管理** | ◎ サーバーレスでインフラ管理の負担がほぼない。 | △ ECS や EC2 の場合、インフラ管理が必要。Lambda はサーバーレス。 |
  | **ネットワーク管理** | ○ デフォルトで簡素なネットワーク管理。高度なネットワーク設定は手間がかかる。 | ◎ AWS VPC を使用して細かいネットワーク管理が可能。柔軟性が高い。 |
  | **Redis との統合** | ○ Google Cloud Memorystore を使用。設定が必要だが可能。 | ◎ Amazon ElastiCache で Redis が簡単に利用可能。 |
  | **PostgreSQL との統合** | ○ Cloud SQL を使用して PostgreSQL と連携。VPC コネクタが必要な場合もあり。 | ◎ RDS を使用して PostgreSQL とシームレスに連携可能。 |
  | **セキュリティ** | ○ Google Cloud IAM で簡単にアクセス制御が可能。Google のセキュリティ基準を利用。 | ◎ AWS IAM で強力なアクセス制御が可能。細かい設定が必要。 |
  | **初期設定の手間** | ◎ 非常に少ない。デフォルトで多くの機能が自動化。 | △ 初期設定に時間がかかる場合があり、学習曲線がある。 |
  | **サポートとドキュメント** | ◎ Google Cloud の豊富な初心者向けドキュメントが揃っている。 | ○ AWS のドキュメントは充実しているが、初心者には難解な部分が多い。 |
    <aside>
    💡 SyncEraでは、以下の理由からGoogle Cloud Runを選択：
    
    主に、AWSと比較したところ、デプロイが簡便にできるところや、システムの処理能力を需要に応じて拡張するこスケーリングが自動で設定されていること、そのほか、コスト効率やFirebase統合の面で優れている点が、
    
    今回のアプリ開発（開発サイクルが短期間とチームの技術スキルレベル）にマッチしていると考え選定。
    </aside></details>

## 各種ドキュメント

### [SyncEra/docs ディレクトリへ保存](https://github.com/ms-engineer-bc24-06/SyncEra/blob/dev/docs)

- プロダクト要求仕様書 (pdr.md)
- 画面仕様書（WF）（WF.md）
- デザインガイドライン（design.md）
- API 設計書(api_design.json)
- データベース構造(db_design.md)
- ER 図(ER_0820.png)
- アーキテクチャ図(architecture_diagram.png)
- コーディング規約(coding_rules.md)
- ESLint 各環境での設定方法（ESLint.md）
- 非機能要件設計書(nonfunctional_requirements.md)
- 負荷テスト実施結果(jmeter_scenario.md)
- E2E テスト（概要、結果）(E2E_scenario.md)

- 全て統合した compose を立ち上げる手順(standing_procedure.md)

## 参考資料

- SyncEra/docs ディレクトリ><br>
  プロダクト要求仕様書 (pdr.md)><br>[関係資料（issue の調査）](https://github.com/ms-engineer-bc24-06/SyncEra/blob/dev/docs/pdr.md)
