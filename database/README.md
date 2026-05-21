# Banco de dados da mesa online

Recomendacao atual para a fase gratuita: Supabase.

Motivo:
- Postgres guarda o estado completo da mesa em `jsonb`.
- Auth, Realtime e Edge Functions ficam no mesmo projeto.
- O plano gratuito atende uma mesa pequena, mas projetos inativos podem pausar.

Arquivos:
- `rpg_tables.sql`: estrutura inicial para salvar salas por login.

Fluxo previsto:
1. Mestre cria login e senha na pagina de aventuras.
2. App envia login, senha e estado inicial para RPCs do Supabase.
3. Banco salva `password_hash`, nunca a senha pura.
4. Jogadores entram com login e senha.
5. Atualizacoes da ficha gravam o campo `state` e tambem usam Broadcast
   Realtime para avisar outros navegadores conectados.

Enquanto a nuvem nao estiver configurada, o app salva a mesa inteira em
`localStorage` pelo servico `src/services/rpgTableStorage.ts`.

Para ativar:
1. Rode `database/rpg_tables.sql` no SQL Editor do Supabase.
2. Copie `.env.example` para `.env.local`.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Reinicie o servidor Vite.
