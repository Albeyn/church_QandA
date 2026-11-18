create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question text not null
    check (char_length(btrim(question)) between 8 and 1000),
  topic text not null
    check (topic in ('Faith & life', 'The Bible', 'Church', 'Other')),
  source text not null default 'anonymous'
    check (source in ('anonymous', 'guide')),
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'answered', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.questions
  add column if not exists source text not null default 'anonymous';

alter table public.questions
  drop constraint if exists questions_source_check;

alter table public.questions
  add constraint questions_source_check
  check (source in ('anonymous', 'guide'));

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.qna_settings (
  id boolean primary key default true check (id),
  guide_question text not null default 'What’s on your mind?'
    check (char_length(btrim(guide_question)) between 8 and 120),
  answer_date date
);

insert into public.qna_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.questions enable row level security;
alter table public.admin_users enable row level security;
alter table public.qna_settings enable row level security;

revoke all on table public.questions from anon, authenticated;
revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.qna_settings from anon, authenticated;

grant insert (question, topic) on public.questions to anon, authenticated;
grant select (id, question, topic, source, status, created_at) on public.questions to authenticated;
grant insert (question, topic, source) on public.questions to authenticated;
grant update (status) on public.questions to authenticated;
grant select (user_id) on public.admin_users to authenticated;
grant select (id, guide_question, answer_date) on public.qna_settings to anon, authenticated;
grant update (guide_question, answer_date) on public.qna_settings to authenticated;

drop policy if exists "Anyone can submit a pending question" on public.questions;
create policy "Anyone can submit a pending question"
  on public.questions
  for insert
  to anon, authenticated
  with check (status = 'pending' and source = 'anonymous');

drop policy if exists "Admins can add guide questions" on public.questions;
create policy "Admins can add guide questions"
  on public.questions
  for insert
  to authenticated
  with check (
    status = 'pending'
    and source = 'guide'
    and exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can view questions" on public.questions;
create policy "Admins can view questions"
  on public.questions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update question status" on public.questions;
create policy "Admins can update question status"
  on public.questions
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can see their own admin record" on public.admin_users;
create policy "Admins can see their own admin record"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can view public Q&A settings" on public.qna_settings;
create policy "Anyone can view public Q&A settings"
  on public.qna_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update public Q&A settings" on public.qna_settings;
create policy "Admins can update public Q&A settings"
  on public.qna_settings
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create or replace function public.get_public_question_stats()
returns table (submitted bigint, answered bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    count(*)::bigint,
    count(*) filter (where status = 'answered')::bigint
  from public.questions
  where source = 'anonymous';
$$;

revoke all on function public.get_public_question_stats() from public, anon, authenticated;
grant execute on function public.get_public_question_stats() to anon, authenticated;
