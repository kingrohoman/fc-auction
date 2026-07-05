create table if not exists public.fc_auction_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.fc_auction_state enable row level security;

drop policy if exists "fc auction read state" on public.fc_auction_state;
create policy "fc auction read state"
on public.fc_auction_state
for select
using (id = 'main');

drop policy if exists "fc auction insert state" on public.fc_auction_state;
create policy "fc auction insert state"
on public.fc_auction_state
for insert
with check (id = 'main');

drop policy if exists "fc auction update state" on public.fc_auction_state;
create policy "fc auction update state"
on public.fc_auction_state
for update
using (id = 'main')
with check (id = 'main');

alter publication supabase_realtime add table public.fc_auction_state;
