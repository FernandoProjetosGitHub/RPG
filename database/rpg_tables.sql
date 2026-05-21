create extension if not exists pgcrypto;

create table if not exists public.rpg_tables (
  id uuid primary key default gen_random_uuid(),
  login text not null unique,
  password_hash text not null,
  adventure_id text not null,
  adventure_title text not null,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rpg_tables_login_idx
  on public.rpg_tables (login);

create or replace function public.set_rpg_tables_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists rpg_tables_updated_at on public.rpg_tables;

create trigger rpg_tables_updated_at
before update on public.rpg_tables
for each row
execute function public.set_rpg_tables_updated_at();

alter table public.rpg_tables enable row level security;

-- O acesso por login/senha deve passar por RPC/Edge Function:
-- 1. recebe login e senha em HTTPS;
-- 2. compara a senha com password_hash;
-- 3. retorna ou atualiza apenas o state da mesa autorizada.
-- Evite expor password_hash diretamente para o cliente.
