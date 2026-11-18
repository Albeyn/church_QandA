-- Run this once in the Supabase SQL Editor so the public page can show
-- community submitted / answered totals without revealing question text.

grant select (source, status) on public.questions to anon;

drop policy if exists "Anyone can view anonymous question status counts" on public.questions;
create policy "Anyone can view anonymous question status counts"
  on public.questions
  for select
  to anon
  using (source = 'anonymous');

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

notify pgrst, 'reload schema';
