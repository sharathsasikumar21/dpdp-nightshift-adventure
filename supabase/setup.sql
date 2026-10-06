-- DPDP Nightshift public score board.
-- Run in the Supabase SQL Editor after reviewing the public score policy.
-- No email, real name, or other personal data is stored.

create table if not exists public.nightshift_scores (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 32),
  points integer not null check (points between 0 and 1875),
  decisions_correct integer not null check (decisions_correct between 0 and 15),
  missions_completed integer not null check (missions_completed between 0 and 5),
  created_at timestamptz not null default now()
);

alter table public.nightshift_scores enable row level security;
revoke all on table public.nightshift_scores from public, anon, authenticated;
grant select, insert on table public.nightshift_scores to anon, authenticated;

drop policy if exists "Anyone can read the public score board" on public.nightshift_scores;
create policy "Anyone can read the public score board"
  on public.nightshift_scores for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit a bounded score" on public.nightshift_scores;
create policy "Anyone can submit a bounded score"
  on public.nightshift_scores for insert
  to anon, authenticated
  with check (
    char_length(nickname) between 1 and 32
    and points between 0 and 1875
    and decisions_correct between 0 and 15
    and missions_completed between 0 and 5
  );
