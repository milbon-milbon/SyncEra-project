### ESLint と Prettier を導入し、Airbnb のルールセットを適用する設定を行う方法

ESLint と Prettier を導入し、Airbnb のルールセットを適用することで、多くのコードスタイルの問題を自動的に修正できます。Next.js（TypeScript）のフロントエンドと FastAPI（Python）のバックエンドの両方に対して設定を行います。

<details><summary> フロントエンド（Next.js with TypeScript）の設定:</summary>

- `.eslintrc.json`の記載を訂正

```bash
{
  "extends": [
    "next/core-web-vitals",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    // 必要に応じてカスタムルールをここに追加
  }
}
```

- `.prettierrc` ファイルを作成（pakage.json と同じ階層し、以下の内容を追加します:

```jsx
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}
```

- VSCode を使用している場合は、ワークスペースの設定（`.vscode/settings.json`）で以下のように設定を追加すると、保存時に自動的に Prettier が適用されます：
  **※ここは各自で設定必要です。**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

- package ジェイソン訂正

```json
-----記載省略-----
 "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",#追加
    "format": "prettier --write .",#追加
    "check-format": "prettier --check ."#追加
  },

```

</details>
<details><summary>バックエンド（FastAPI with Python）の設定:</summary>

1. 必要なパッケージをインストールします:

```bash
pip install flake8 black isort
```

- パッケージについて

  - **flake8** :[【初心者向け】Visual Studio Code へ flake8 を導入する](https://qiita.com/fehde/items/723b619013dc86008acc)
    [flake8 公式サイト](https://pypi.org/project/flake8/)

    - **概要**: Python のコードをリンティングするツールです。PEP 8 に準拠したコードスタイルのチェックを行います。
    - **機能**: コードのスタイルチェック、コードのバグやセキュリティの問題の検出、コードの品質の向上。
    - **インストール**:

      ```bash

      pip install flake8

      ```

  - **black**: [Black できれいに自動整形！flake8 と Black 導入と実行](https://qiita.com/tsu_0514/items/2d52c7bf79cd62d4af4a)

    - **概要**: Python のコードフォーマッターです。PEP 8 に準拠したコードスタイルに自動的にフォーマットします。
    - **機能**: コードの一貫性を保つために、自動的にコードを整形し、手動でのスタイル修正を減らします。

    - **インストール**:

      ```bash

      pip install black

      ```

  - **isort**:

    - **概要**: Python のインポート文を自動的にソートおよび整理するツールです。
    - **機能**: インポート文のアルファベット順の整理、インポートの分割とグループ化、未使用のインポートの削除。
    - **インストール**:

      ```bash

      pip install isort

      ```

1. プロェクトのルートに `.flake8` ファイルを作成し、以下の内容を追加します:

```
[flake8]
max-line-length = 88  # 1行の最大文字数を88文字に設定
extend-ignore = E203, E266, E501, W503  # 無視するエラーコードを指定
```

- 設定内容
  - `max-line-length`: `flake8`が 1 行の最大文字数をチェックする際の基準。88 文字に設定。
  - `extend-ignore`: 無視するエラーコードを指定。以下のエラーコードを無視します。
    - `E203`: スライスのコロンの前後に空白を入れるべきかどうか
    - `E266`: 行コメントの後の多重コメント記号
    - `E501`: 1 行の最大文字数を超えているかどうか
    - `W503`: 演算子の前に改行があるかどうか

1. `pyproject.toml` ファイルを作成し、以下の内容を追加します:

```toml
[tool.black]
line-length = 88  # 1行の最大文字数を88文字に設定
target-version = ['py38']  # ターゲットとするPythonのバージョンを指定
include = '\.pyi?$'  # 適用するファイルのパターン
extend-exclude = '''
/(
  # 除外するディレクトリ
  \.eggs
  | \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | build
  | dist
)/
'''

[tool.isort]
profile = "black"  # blackと同じスタイルを使用
multi_line_output = 3  # 複数行のインポートのスタイルを設定
include_trailing_comma = true  # 複数行のインポートにトレーリングカンマを含める
force_grid_wrap = 0  # グリッドラップを強制しない
use_parentheses = true  # インポートの括弧を使用
ensure_newline_before_comments = true  # コメントの前に改行を追加
line_length = 88  # 1行の最大文字数を88文字に設定

```

- 設定内容
  - `[tool.black]`: `black`の設定セクション。
    - `line-length`: 1 行の最大文字数を 88 文字に設定。
    - `target-version`: ターゲットとする Python のバージョン。`py38`は Python 3.8 を示します。
    - `include`: `black`が適用されるファイルのパターン。`.py`と`.pyi`ファイルに適用。
    - `extend-exclude`: 除外するディレクトリのパターン。`.eggs`, `.git`, `.hg`, `.mypy_cache`, `.tox`, `.venv`, `build`, `dist`ディレクトリを除外。
  - `[tool.isort]`: `isort`の設定セクション。
    - `profile`: `black`のスタイルを使用。
    - `multi_line_output`: 複数行のインポートのスタイル。`3`は垂直に並べるスタイル。
    - `include_trailing_comma`: 複数行のインポートにトレーリングカンマを含める。
    - `force_grid_wrap`: グリッドラップを強制しない設定。
    - `use_parentheses`: インポートの括弧を使用。
    - `ensure_newline_before_comments`: コメントの前に改行を追加。
    - `line_length`: 1 行の最大文字数を 88 文字に設定。

VSCode の設定:

1. 以下の拡張機能をインストールします:
   - ESLint
   - Prettier - Code formatter
   - Python
2. VSCode の `settings.json` に以下の設定を追加します: このファイルは、main にマージされています

- ※注意
  下記のファイルのパスは、それぞれの環境で設定が必要になります

  ```jsx
  "python.formatting.blackPath": "venv/bin/black", // Windowsの場合は "venv\\Scripts\\black"
    "python.sortImports.path": "venv/bin/isort", // Windowsの場合は "venv\\Scripts\\isort"
    "python.linting.flake8Path": "venv/bin/flake8", // Windowsの場合は "venv\\Scripts\\flake8"
  ```

  - ファイルのパスの確認方法
    以下の手順で各ツールのパスを確認し、VSCode の設定ファイルに反映させます。

    ### 手順

    1.  **ツールのインストール場所を確認**
        コマンドラインで以下のコマンドを実行して、各ツールのインストール場所を確認します。
        ```bash

            which black
            which isort
            which flake8

            ```

            各コマンドの出力として、ツールがインストールされているパスが表示されます。例えば、`/usr/local/bin/black`のように表示されます。

    2.  **VSCode の設定ファイルに反映**
        確認したパスを使用して、VSCode の設定ファイルに記載します。

    ### 例: 設定ファイル（`settings.json`）

    ```json
    {
      "python.linting.enabled": true,
      "python.linting.flake8Enabled": true,
      "python.formatting.provider": "black",
      "python.formatting.blackPath": "/usr/local/bin/black",
      "python.sortImports.path": "/usr/local/bin/isort",
      "python.linting.flake8Path": "/usr/local/bin/flake8",
      "python.linting.flake8Args": [
        "--max-line-length=88",
        "--ignore=E203,E266,E501,W503"
      ],
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
      },
      "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
      ],
      "prettier.singleQuote": true,
      "prettier.trailingComma": "all",
      "prettier.printWidth": 100,
      "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[python]": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "ms-python.python"
      },
      "python.formatting.provider": "black",
      "python.linting.flake8Enabled": true,
      "python.linting.enabled": true,
      "python.sortImports.args": ["--profile", "black"]
    }
    ```

    ### 注意点

    - 上記のパスは例です。実際のインストール場所に応じてパスを変更してください。
    - `which`コマンドを実行しても何も表示されない場合は、ツールがインストールされていない可能性があります。その場合は、まずツールをインストールしてください。

    ### まとめ

    - ツールのインストール場所を確認するために`which`コマンドを使用します。
    - 確認したパスを VSCode の設定ファイルに記載します。
      このように設定することで、`venv`を使用していない環境でも、ツールのパスを適切に設定できます。

```json
{
  "python.linting.enabled": true, // Pythonのリンティングを有効化
  "python.linting.flake8Enabled": true, // flake8を有効化
  "python.formatting.provider": "black", // フォーマッタにblackを使用
  "python.formatting.blackPath": "venv/bin/black", // Windowsの場合は "venv\\Scripts\\black"
  "python.sortImports.path": "venv/bin/isort", // Windowsの場合は "venv\\Scripts\\isort"
  "python.linting.flake8Path": "venv/bin/flake8", // Windowsの場合は "venv\\Scripts\\flake8"
  "python.linting.flake8Args": [
    "--max-line-length=88",
    "--ignore=E203,E266,E501,W503"
  ],
  "editor.formatOnSave": true, // 保存時に自動フォーマットを有効化
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true, // ESLintで全ての問題を修正
    "source.organizeImports": true // 保存時にインポートを整理
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "prettier.singleQuote": true,
  "prettier.trailingComma": "all",
  "prettier.printWidth": 100,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.python"
  },
  "python.formatting.provider": "black",
  "python.linting.flake8Enabled": true,
  "python.linting.enabled": true,
  "python.sortImports.args": ["--profile", "black"]
}
```

</details>
