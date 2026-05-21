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
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rpg_tables_updated_at on public.rpg_tables;

create trigger rpg_tables_updated_at
before update on public.rpg_tables
for each row
execute function public.set_rpg_tables_updated_at();

alter table public.rpg_tables enable row level security;

revoke all on public.rpg_tables from anon;
revoke all on public.rpg_tables from authenticated;

create or replace function public.rpg_create_table(
  p_login text,
  p_password text,
  p_adventure_id text,
  p_adventure_title text,
  p_state jsonb
)
returns table (
  table_id uuid,
  login text,
  adventure_id text,
  adventure_title text,
  state jsonb,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if length(trim(p_login)) < 3 then
    raise exception 'Login da mesa precisa ter pelo menos 3 caracteres.';
  end if;

  if length(trim(p_password)) < 8 then
    raise exception 'Senha da mesa precisa ter pelo menos 8 caracteres.';
  end if;

  return query
  insert into public.rpg_tables (
    login,
    password_hash,
    adventure_id,
    adventure_title,
    state
  )
  values (
    lower(trim(p_login)),
    crypt(p_password, gen_salt('bf')),
    p_adventure_id,
    p_adventure_title,
    p_state
  )
  returning
    rpg_tables.id,
    rpg_tables.login,
    rpg_tables.adventure_id,
    rpg_tables.adventure_title,
    rpg_tables.state,
    rpg_tables.updated_at;
exception
  when unique_violation then
    raise exception 'Este login de mesa ja existe. Crie outro acesso.';
end;
$$;

create or replace function public.rpg_load_table(
  p_login text,
  p_password text
)
returns table (
  table_id uuid,
  login text,
  adventure_id text,
  adventure_title text,
  state jsonb,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    id as table_id,
    rpg_tables.login,
    rpg_tables.adventure_id,
    rpg_tables.adventure_title,
    rpg_tables.state,
    rpg_tables.updated_at
  from public.rpg_tables
  where
    rpg_tables.login = lower(trim(p_login))
    and rpg_tables.password_hash = crypt(p_password, rpg_tables.password_hash)
  limit 1;
$$;

create or replace function public.rpg_save_table(
  p_login text,
  p_password text,
  p_state jsonb
)
returns table (
  table_id uuid,
  login text,
  adventure_id text,
  adventure_title text,
  state jsonb,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.rpg_tables
  set state = p_state
  where
    rpg_tables.login = lower(trim(p_login))
    and rpg_tables.password_hash = crypt(p_password, rpg_tables.password_hash)
  returning
    rpg_tables.id,
    rpg_tables.login,
    rpg_tables.adventure_id,
    rpg_tables.adventure_title,
    rpg_tables.state,
    rpg_tables.updated_at;
end;
$$;

revoke all on function public.rpg_create_table(text, text, text, text, jsonb) from public;
revoke all on function public.rpg_load_table(text, text) from public;
revoke all on function public.rpg_save_table(text, text, jsonb) from public;

grant execute on function public.rpg_create_table(text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.rpg_load_table(text, text) to anon, authenticated;
grant execute on function public.rpg_save_table(text, text, jsonb) to anon, authenticated;
