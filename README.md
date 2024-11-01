# Finance Application - API


Este repositório contém o código para uma aplicacao financeira destinada ao teste de backend pleno.
---

## 🛠️ Requirements

- **Node.js**: v22.9.0 Ou acima
- **Docker**: Tenha certeza de que o docker esta funcionando

---

## 🚀 Para começar

1. **Clone o repositório**: 
   ```bash
   git clone <url>
   cd teste_backend_cubos
Com o docker rodando, execute na root do projeto.

```bash
  docker-compose up -d
```
Agora aplicando as migrations

```bash
  npm run migration:run
```
Para as variaveis de ambiente sugiro que utilize a mesma base de arquivo `.env`

```dotenv
DATABASE_HOST=localhost
DATABASE_USER="admin"
DATABASE_PASSWORD="admin"
DATABASE_NAME="banco_financeiro"
DATABASE_PORT=5432
TYPEORM_MIGRATIONS=/src/database/migrations/*.ts
TYPEORM_MIGRATIONS_DIR=/src/database/migrations
SECRET_KEY="teste_backend_cubos"

COMPLIANCE_ENDPOINT="https://compliance-api.cubos.io"
COMPLIANCE_EMAIL=""
COMPLIANCE_PASSWORD=""
```
Preencha COMPLIANCE_EMAIL e COMPLIANCE_PASSWORD com suas credenciais. Esses campos são deixados vazios por razões de segurança, pois devem conter informações específicas do usuário.

Após completar acima, rode o projeto

```bash
  npm run dev
```
As migrations estao localizadas no src/database/migrations

Caso queira criar uma rode
```bash
  npm run migration:create --name=NomeDaMigration
```
