# Negociador IA

TanStack Start + React + Supabase. Roda fora da Lovable: Supabase próprio e deploy na Vercel.

## 1. Supabase (uma vez)
1. Crie um projeto em supabase.com.
2. SQL Editor > cole e rode `supabase/setup.sql` (cria tabelas, RLS, funções e triggers das etapas 01 e 02).
3. Authentication > URL Configuration: defina **Site URL** (domínio da Vercel) e adicione em **Redirect URLs**: `https://SEU-DOMINIO/**` e `http://localhost:8080/**`.
4. Authentication > Providers > Email: mantenha "Confirm email" ligado. Para Google: ative o provider e informe Client ID/Secret (Google Cloud Console; callback `https://SEU_PROJECT_ID.supabase.co/auth/v1/callback`).
5. Project Settings > API: copie a URL e a publishable key.

## 2. Rodar local
```sh
cp .env.example .env   # preencha com as chaves do seu projeto
bun install            # ou npm i
bun run dev            # http://localhost:8080
```

## 3. Deploy na Vercel
1. Suba este repositório no GitHub e importe na Vercel (Framework: Other; o build usa `vite build` e o preset Nitro `vercel`).
2. Em Settings > Environment Variables, cadastre as **quatro** variáveis de `.env.example` (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
3. Depois do primeiro deploy, coloque o domínio final no Site URL / Redirect URLs do Supabase.

## Testes
`bun run test` (unitários). `src/test/tenant-security.integration.py` valida o isolamento entre organizações contra um projeto Supabase real.

## Notas
- `public/architecture.jpg` é uma imagem de capa provisória; troque pela sua.
- `src/integrations/supabase/types.ts` veio da Lovable e não inclui as tabelas de negociação. Regenere: `npx supabase gen types typescript --project-id SEU_ID > src/integrations/supabase/types.ts`.
