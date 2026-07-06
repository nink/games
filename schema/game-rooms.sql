-- Take 5 multiplayer rooms (run once in Supabase SQL editor)
-- https://supabase.com/dashboard/project/qbmtvyxlagztkxdaazfi/sql

create table if not exists public.game_rooms (
  code text primary key check (char_length(code) = 4),
  state jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists game_rooms_updated_at_idx on public.game_rooms (updated_at);

alter table public.game_rooms enable row level security;

drop policy if exists "game_rooms_select" on public.game_rooms;
create policy "game_rooms_select"
  on public.game_rooms for select
  using (true);

-- Writes go through API (service role) only — no anon insert/update policy.

alter publication supabase_realtime add table public.game_rooms;
