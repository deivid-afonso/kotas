# Assina Backend

API Node.js + Express + MySQL para a plataforma Assina.

## Local

```bash
cp .env.example .env
# edite .env com credenciais de um MySQL local
npm install
npm run dev
```

A API inicializa o banco automaticamente (cria tabelas se não existirem) e cria o admin a partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD` no primeiro boot.

## Deploy no Hostinger Cloud Startup

### 1. Criar banco MySQL
No hPanel:
1. **Databases → Management**
2. **Create new database**:
   - Database name: `assina` (fica tipo `u123_assina`)
   - Username: `assina_user`
   - Senha: gere uma forte
3. Anote: **host** (geralmente `localhost` se Node e MySQL rodam na mesma máquina), **user completo**, **senha**, **database completo**

### 2. Criar app Node.js
No hPanel:
1. **Advanced → Node.js** (ou **Websites → Hosting → Node.js**)
2. **Create application**:
   - Node.js version: 20 ou mais recente
   - Application mode: Production
   - Application root: `assina-api` (ou pasta de sua escolha)
   - Application URL: subdomínio ou pasta (ex: `api.seudominio.com`)
   - Application startup file: `dist/index.js`

### 3. Variáveis de ambiente
Na mesma tela do Node.js, adicione:
- `MYSQL_HOST` = `localhost`
- `MYSQL_PORT` = `3306`
- `MYSQL_USER` = (user completo do passo 1)
- `MYSQL_PASSWORD` = (senha do passo 1)
- `MYSQL_DATABASE` = (database completo do passo 1)
- `JWT_SECRET` = string aleatória longa
- `ADMIN_EMAIL` = seu email de admin
- `ADMIN_PASSWORD` = senha do admin
- `ADMIN_NAME` = seu nome
- `FRONTEND_ORIGIN` = `https://deivid-afonso.github.io`
- `NODE_ENV` = `production`

### 4. Subir código
**Via SSH** (se habilitado em Advanced → SSH Access):
```bash
ssh u123@seu-servidor.hostinger.com
cd ~/assina-api
git clone https://github.com/deivid-afonso/kotas.git tmp
mv tmp/server/* tmp/server/.* . 2>/dev/null
rm -rf tmp
npm install
npm run build
```

**Via File Manager:**
1. Rode `npm install && npm run build` **localmente** no `server/`
2. Compacte `server/` (incluindo `node_modules` e `dist`) em zip
3. No hPanel: **Files → File Manager → upload do zip em `assina-api/`**
4. Extraia

### 5. Startar
Volta na tela Node.js e clica **Restart**. Verifique logs.

### 6. Testar
```bash
curl https://api.seudominio.com/api/health
# deve retornar {"ok":true}
```

### 7. Configurar frontend
No GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**:
- Nome: `VITE_API_URL`
- Valor: `https://api.seudominio.com/api`

Depois rode o workflow **Deploy to GitHub Pages** novamente (ou faça um push na main).

## Endpoints

- `POST /api/auth/register` — `{name, email, password}` → `{token, user}`
- `POST /api/auth/login` — `{email, password}` → `{token, user}`
- `GET /api/auth/me` — retorna usuário logado (Authorization: Bearer)
- `GET /api/users` — lista cadastrados (admin)
- `GET /api/requests` — lista todas solicitações (admin)
- `GET /api/requests/mine` — minhas solicitações
- `POST /api/requests` — `{serviceId, serviceName}` cria solicitação
- `PATCH /api/requests/:id` — `{status: "aprovado"|"recusado"}` (admin)
