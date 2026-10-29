# Assina

Sistema web responsivo para administrar assinaturas anuais compartilhadas, participantes, cobranças consolidadas e pagamentos PIX. Este protótipo usa somente dados fictícios e não integra com plataformas de streaming ou com o Kotas.

## Stack

- React, TypeScript e Vite
- Express e schema SQL relacional (API preparada)
- CSS responsivo, com foco em operação mobile
- PIX configurável via Asaas ou Mercado Pago (próxima etapa)

## Rodando localmente

```bash
npm install
npm run dev
```

O painel abre em `http://localhost:5173`. A API pode ser iniciada em outro terminal com `npm run server`.

## Banco e segurança

O schema relacional está em `db/schema.sql` e guarda valores monetários em centavos, além de registrar alterações em `audit_log`. A API inicial usa endpoints preparados para conexão com Postgres/Supabase, sem dependências nativas para facilitar a execução local. Copie `.env.example` para `.env` e nunca versione chaves PIX, comprovantes ou dados reais.

## Projeto de portfólio

O projeto resolve a substituição de planilhas de anuidades por um fluxo único e auditável, com alerta de ocupação sem bloqueio, cobranças consolidadas e operação PIX. As decisões priorizam clareza financeira, histórico por ciclo anual e uma interface que funciona bem no celular.

## Licença

MIT
