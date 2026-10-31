-- CampusSignal production schema.
-- Run once in Supabase SQL Editor after enabling Email auth.

create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  college text not null default '',
  course text not null default '',
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  preferred_roles text[] not null default '{}',
  is_discoverable boolean not null default false,
  experience_level text not null default 'Beginner'
    check (experience_level in ('Beginner', 'Intermediate', 'Advanced')),
  project_interests text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  title varchar(300) not null,
  organization varchar(255) not null,
  category varchar(100) not null,
  description text not null,
  eligibility text not null,
  required_skills text[] not null default '{}',
  deadline timestamptz not null,
  event_date timestamptz,
  location varchar(255) not null default 'Online',
  registration_url text not null,
  source_type varchar(100) not null default 'User submitted',
  verification_status varchar(100) not null default 'User submitted'
    check (verification_status in ('Officially sourced', 'User submitted', 'Unverified')),
  required_documents text[] not null default '{}',
  important_instructions text not null default '',
  created_at timestamptz not null default now()
);

-- Keep the schema rerunnable while allowing administrator-verified source rows.
alter table public.opportunities
  drop constraint if exists opportunities_verification_status_check;
alter table public.opportunities
  add constraint opportunities_verification_status_check
  check (verification_status in ('Officially sourced', 'User submitted', 'Unverified'));

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  application_status varchar(50) not null default 'Interested'
    check (application_status in ('Interested', 'Applied', 'Completed')),
  created_at timestamptz not null default now(),
  unique(student_id, opportunity_id)
);

create table if not exists public.team_matches (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.students(id) on delete cascade,
  matched_student_id uuid not null references public.students(id) on delete cascade,
  compatibility_score integer not null check (compatibility_score between 0 and 100),
  match_reason text not null,
  created_at timestamptz not null default now(),
  check (requester_id <> matched_student_id)
);

create index if not exists idx_opportunities_category on public.opportunities(category);
create index if not exists idx_opportunities_deadline on public.opportunities(deadline);
create index if not exists idx_opportunities_created_by on public.opportunities(created_by);
create index if not exists idx_students_college on public.students(college);
create index if not exists idx_saved_opportunities_student on public.saved_opportunities(student_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.students (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.students enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.team_matches enable row level security;

-- Remove policies from the old demo schema if it was installed previously.
drop policy if exists "Public read students" on public.students;
drop policy if exists "Public insert students" on public.students;
drop policy if exists "Public update students" on public.students;
drop policy if exists "Public read opportunities" on public.opportunities;
drop policy if exists "Public insert opportunities" on public.opportunities;
drop policy if exists "Public update opportunities" on public.opportunities;
drop policy if exists "Public read saved_opportunities" on public.saved_opportunities;
drop policy if exists "Public insert saved_opportunities" on public.saved_opportunities;
drop policy if exists "Public update saved_opportunities" on public.saved_opportunities;
drop policy if exists "Public delete saved_opportunities" on public.saved_opportunities;
drop policy if exists "Public read team_matches" on public.team_matches;
drop policy if exists "Public insert team_matches" on public.team_matches;

drop policy if exists "Signed-in students can view profiles" on public.students;
create policy "Signed-in students can view profiles" on public.students
  for select to authenticated using (auth.uid() = id or is_discoverable);
drop policy if exists "Students can update their own profile" on public.students;
create policy "Students can update their own profile" on public.students
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Students can create their own profile" on public.students;
create policy "Students can create their own profile" on public.students
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Signed-in students can view opportunities" on public.opportunities;
create policy "Signed-in students can view opportunities" on public.opportunities
  for select to authenticated using (true);
drop policy if exists "Students can submit opportunities" on public.opportunities;
create policy "Students can submit opportunities" on public.opportunities
  for insert to authenticated
  with check (auth.uid() = created_by and verification_status = 'User submitted');
drop policy if exists "Owners can edit their submissions" on public.opportunities;
create policy "Owners can edit their submissions" on public.opportunities
  for update to authenticated using (auth.uid() = created_by)
  with check (auth.uid() = created_by and verification_status = 'User submitted');
drop policy if exists "Owners can delete their submissions" on public.opportunities;
create policy "Owners can delete their submissions" on public.opportunities
  for delete to authenticated using (auth.uid() = created_by);

drop policy if exists "Students can view their saved opportunities" on public.saved_opportunities;
create policy "Students can view their saved opportunities" on public.saved_opportunities
  for select to authenticated using (auth.uid() = student_id);
drop policy if exists "Students can save opportunities for themselves" on public.saved_opportunities;
create policy "Students can save opportunities for themselves" on public.saved_opportunities
  for insert to authenticated with check (auth.uid() = student_id);
drop policy if exists "Students can update their saved opportunities" on public.saved_opportunities;
create policy "Students can update their saved opportunities" on public.saved_opportunities
  for update to authenticated using (auth.uid() = student_id) with check (auth.uid() = student_id);
drop policy if exists "Students can remove their saved opportunities" on public.saved_opportunities;
create policy "Students can remove their saved opportunities" on public.saved_opportunities
  for delete to authenticated using (auth.uid() = student_id);

drop policy if exists "Participants can view team matches" on public.team_matches;
create policy "Participants can view team matches" on public.team_matches
  for select to authenticated using (auth.uid() = requester_id or auth.uid() = matched_student_id);
