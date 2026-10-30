# Assina Backend

API Node.js + Express + Postgres para a plataforma Assina.

## Local

```bash
cp .env.example .env
# edite .env com DATABASE_URL de um Postgres local
npm install
npm run dev
```

A API inicializa o banco automaticamente (cria tabelas se não existirem) e cria o admin a partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD` no primeiro boot.

## Deploy no Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub repo** → selecione `kotas`
3. Em **Settings → Root Directory** coloque `server`
4. **New → Database → PostgreSQL** (gera `DATABASE_URL` automaticamente)
5. Em **Variables** do serviço, adicione:
   - `JWT_SECRET` = (string aleatória longa)
   - `ADMIN_EMAIL` = `deividsa@gmail.com`
   - `ADMIN_PASSWORD` = (sua senha de admin)
   - `ADMIN_NAME` = `Deivid Afonso`
   - `FRONTEND_ORIGIN` = `https://deivid-afonso.github.io`
6. Em **Settings → Networking → Generate Domain** para obter a URL pública (ex: `https://assina.up.railway.app`)
7. Volte no GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**:
   - Nome: `VITE_API_URL`
   - Valor: `https://assina.up.railway.app/api`
8. Rode o workflow **Deploy to GitHub Pages** novamente (ou faça um push) para o frontend passar a usar o backend novo.

## Endpoints

- `POST /api/auth/register` — `{name, email, password}` → `{token, user}`
- `POST /api/auth/login` — `{email, password}` → `{token, user}`
- `GET /api/auth/me` — retorna usuário logado (Authorization: Bearer)
- `GET /api/users` — lista cadastrados (admin)
- `GET /api/requests` — lista todas solicitações (admin)
- `GET /api/requests/mine` — minhas solicitações
- `POST /api/requests` — `{serviceId, serviceName}` cria solicitação
- `PATCH /api/requests/:id` — `{status: "aprovado"|"recusado"}` (admin)
