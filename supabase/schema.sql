-- Habitly database schema
-- Run this in the Supabase SQL editor for a fresh project.

create extension if not exists "pgcrypto";

create table if not exists public.habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null check (length(name) between 1 and 80),
  description  text,
  color        text not null default '#6366f1',
  target_per_week smallint not null default 7 check (target_per_week between 1 and 7),
  created_at   timestamptz not null default now(),
  archived_at  timestamptz
);

create index if not exists habits_user_idx on public.habits(user_id);

create table if not exists public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  logged_at  timestamptz not null default now(),
  -- day_key is the local calendar day the log belongs to (YYYY-MM-DD).
  -- Stored as text so the client's local timezone is authoritative.
  day_key    text not null,
  note       text,
  unique (habit_id, day_key)
);

create index if not exists habit_logs_user_idx on public.habit_logs(user_id);
create index if not exists habit_logs_habit_idx on public.habit_logs(habit_id);

-- Row level security: each user sees only their rows.
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

drop policy if exists "habits_select_own" on public.habits;
create policy "habits_select_own" on public.habits
  for select using (auth.uid() = user_id);

drop policy if exists "habits_insert_own" on public.habits;
create policy "habits_insert_own" on public.habits
  for insert with check (auth.uid() = user_id);

drop policy if exists "habits_update_own" on public.habits;
create policy "habits_update_own" on public.habits
  for update using (auth.uid() = user_id);

drop policy if exists "habits_delete_own" on public.habits;
create policy "habits_delete_own" on public.habits
  for delete using (auth.uid() = user_id);

drop policy if exists "logs_select_own" on public.habit_logs;
create policy "logs_select_own" on public.habit_logs
  for select using (auth.uid() = user_id);

drop policy if exists "logs_insert_own" on public.habit_logs;
create policy "logs_insert_own" on public.habit_logs
  for insert with check (auth.uid() = user_id);

drop policy if exists "logs_delete_own" on public.habit_logs;
create policy "logs_delete_own" on public.habit_logs
  for delete using (auth.uid() = user_id);
