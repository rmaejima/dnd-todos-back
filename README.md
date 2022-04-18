# Wantedly Todos Back
## 実行環境
- Node.js: v16.18.0
- Fastify(TypeScript)
- postgresQL
- prisma
- Docker
## 実行手順
1. 環境変数を設定します。
```
cp .env.sample .env
```
2. postgresQLのDockerコンテナを立ち上げます。
```
docker-compose up -d
```
3. パッケージをインストールします。
```
yarn
```
4. データベースのマイグレーションを行います。
```
npx prisma migrate dev
```
5. アプリを立ち上げます。
```
yarn dev
```
## 補足
以下のコマンド実行することで、`localhost:5555`番にデータベースクライアントサービスが立ち上がり、データベースの値を変更することができます。
```
npx prisma studio
```

## 工夫した点
wantedly-todos-frontの方で記載しております。
