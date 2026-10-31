-- Allow an authenticated student to create only their own missing profile.
-- This repairs accounts created before the auth.users profile trigger existed.
drop policy if exists "Students can create their own profile" on public.students;
create policy "Students can create their own profile" on public.students
  for insert to authenticated with check (auth.uid() = id);
