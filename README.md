# 環境構築の手順

## 1. Flutter バージョンを設定

```bash
# fvm をインストール
dart pub global activate fvm
# flutter のバージョンをインストール
fvm install
```

## 2. 環境変数を設定

```bash
cp .env.example .env
```

# アプリケーションアーキテクチャ説明

## アーキテクチャ図
![Image](https://github.com/user-attachments/assets/61f34fcd-69f6-4722-9171-86e7e8810618)

## 1. フォルダ構成の概要

```
lib/
├── core/                     # アプリケーション全体で使用する共通機能
├── domain/                   # ビジネスロジックの中心
├── data/                     # データ操作の実装
├── presentation/            # UI関連
├── services/                # プラットフォーム機能のラッパー
└── utils/                   # 純粋な機能の集まり
```

## 2. 各レイヤーの説明

### 2.1 Core 層

アプリケーション全体で使用される共通の機能を提供します。

```
core/
├── config/         # 環境変数や設定値（変更可能な値）
├── constants/      # 固定値（変更されない値）
├── theme/          # アプリケーションのテーマ設定
├── enums/          # 列挙型の定義
├── exceptions/     # カスタム例外の定義
└── extensions/     # 拡張機能の定義
```

### 2.2 Domain 層

アプリケーションのビジネスロジックの中心となる層です。

```
domain/
├── entities/       # ビジネスロジックで使用する純粋なデータ構造
├── repositories/   # データ操作のインターフェース（抽象クラス）
└── usecases/       # 具体的なビジネスロジックの実装
```

### 2.3 Data 層

データの取得・保存に関する具体的な実装を提供します。

```
data/
├── datasources/    # データの取得元（API, DB等）との通信実装
├── models/         # 外部とのデータ変換用のモデル
└── repositories/   # Domain層で定義したリポジトリの具体的な実装
```

### 2.4 Presentation 層

ユーザーインターフェースに関する実装を提供します。

```
presentation/
├── controllers/    # 状態管理とビジネスロジックの橋渡し
├── pages/          # 画面の定義
└── widgets/        # 再利用可能なUI部品
```

### 2.5 Services 層

プラットフォーム固有の機能をラップします。

```
services/
├── analytics/      # アナリティクス関連
├── camera/         # カメラ機能
├── location/       # 位置情報
└── storage/        # ストレージ
```

### 2.6 Utils 層

純粋な機能の集まりを提供します。

```
utils/
├── formatters/     # データフォーマット
├── helpers/        # ヘルパー関数
└── validators/     # バリデーション
```

## 3. データの流れ

1. UI（Presentation 層）でユーザーアクションが発生
2. Controller（Presentation 層）が UseCase を呼び出し
3. UseCase（Domain 層）が Repository インターフェースを通じてデータを要求
4. RepositoryImpl（Data 層）が適切な DataSource を使用してデータを取得
5. DataSource が外部システム（API など）と通信
6. 取得したデータを Model（Data 層）から Entity（Domain 層）に変換
7. Entity を使用してビジネスロジックを実行
8. 結果を UI に反映

## 4. 各レイヤーの責任

### Domain 層の責任

- ビジネスロジックの定義
- データ操作の抽象化
- アプリケーションの中心的なルール

### Data 層の責任

- 外部システムとの通信
- データの変換
- キャッシュの管理
- Repository 実装の提供

### Presentation 層の責任

- ユーザーインターフェース
- 状態管理
- ユーザーアクションのハンドリング

### Services 層の責任

- プラットフォーム機能のラッピング
- SDK の抽象化
- デバイス機能へのアクセス

### Utils 層の責任

- 純粋な機能の提供
- 状態を持たないヘルパー関数
- 再利用可能なユーティリティ

## 5. コード例

```dart
// Domain層: エンティティ
class User {
  final String id;
  final String fullName;
  final UserRole role;

  bool canAccessAdmin() {
    return role == UserRole.admin;
  }
}

// Data層: モデル
class UserModel {
  final String id;
  final String firstName;
  final String lastName;

  User toEntity() {
    return User(
      id: id,
      fullName: '$firstName $lastName',
      role: UserRole.fromId(roleId),
    );
  }
}

// Domain層: リポジトリインターフェース
abstract class UserRepository {
  Future<User> getUser(String id);
}

// Data層: リポジトリ実装
class UserRepositoryImpl implements UserRepository {
  final UserDataSource dataSource;

  @override
  Future<User> getUser(String id) async {
    final userModel = await dataSource.getUser(id);
    return userModel.toEntity();
  }
}
```

## 6. メリット

1. **関心の分離**

   - 各層の責任が明確
   - コードの見通しが良い
   - テストが書きやすい

2. **変更への強さ**

   - 外部システムの変更の影響を限定的に
   - ビジネスロジックの独立性を確保
   - 実装の詳細を隠蔽

3. **スケーラビリティ**
   - 機能追加が容易
   - チーム開発での作業分担がしやすい
   - コードの再利用性が高い
