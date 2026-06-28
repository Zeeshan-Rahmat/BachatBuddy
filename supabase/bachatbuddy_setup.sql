-- 1. Users profile table
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid,
  business_name text,
  name text not null,
  phone text,
  business_phone text,
  email text not null unique,
  business_email text,
  role text not null check (role in ('owner', 'employee')),
  username text not null unique,
  password_hash text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  biometric_enabled boolean not null default false,
  address text,
  business_address text,
  business_logo text,
  img text,
  sync_status text not null default 'synced' check (
    sync_status in (
      'synced',
      'pending_insert',
      'pending_update',
      'pending_delete',
      'pending_approval',
      'rejected'
    )
  ),
  updated_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  created_at bigint not null default ((extract(epoch from now()) * 1000)::bigint)
);

-- Add columns for older existing tables.
alter table public.users add column if not exists business_id uuid;
alter table public.users add column if not exists business_name text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists business_phone text;
alter table public.users add column if not exists business_email text;
alter table public.users add column if not exists password_hash text;
alter table public.users add column if not exists biometric_enabled boolean not null default false;
alter table public.users add column if not exists address text;
alter table public.users add column if not exists business_address text;
alter table public.users add column if not exists business_logo text;
alter table public.users add column if not exists img text;
alter table public.users add column if not exists sync_status text not null default 'synced';

-- Convert timestamp columns from older setup to app-compatible millisecond values.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'updated_at'
      and data_type = 'timestamp with time zone'
  ) then
    execute 'alter table public.users alter column updated_at drop default';
    execute 'alter table public.users alter column updated_at type bigint using (extract(epoch from updated_at) * 1000)::bigint';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'created_at'
      and data_type = 'timestamp with time zone'
  ) then
    execute 'alter table public.users alter column created_at drop default';
    execute 'alter table public.users alter column created_at type bigint using (extract(epoch from created_at) * 1000)::bigint';
  end if;
end $$;

alter table public.users
  alter column updated_at set default ((extract(epoch from now()) * 1000)::bigint),
  alter column created_at set default ((extract(epoch from now()) * 1000)::bigint);

update public.users
set business_id = id
where business_id is null
  and role = 'owner';

create unique index if not exists idx_users_username on public.users(username);
create unique index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_users_business_id on public.users(business_id);
create index if not exists idx_users_sync_status on public.users(sync_status);

alter table public.users enable row level security;

-- Helper functions avoid recursive RLS checks inside policies.
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role
  from public.users
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.current_user_business_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select coalesce(business_id, id)
  from public.users
  where id = auth.uid()
  limit 1;
$$;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_business_id() to authenticated;

drop policy if exists "Users can read own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;
drop policy if exists "Owners can read employee profiles" on public.users;

create policy "Users can read own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Owners can read employee profiles"
on public.users
for select
to authenticated
using (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() is not null
  and public.current_user_business_id() = coalesce(business_id, id)
);

-- 2. Username lookup RPC used before sign-in.
create or replace function public.get_email_by_username(p_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select email
  from public.users
  where username = lower(trim(p_username))
  limit 1;
$$;

grant execute on function public.get_email_by_username(text) to anon, authenticated;

-- 3. Staging review queue for employee approval workflow.
-- Column names match src/services/syncQueueProcessor.ts.
create table if not exists public.staging_review_queue (
  id uuid primary key default gen_random_uuid(),
  source_table text not null,
  source_record_id text not null,
  operation text not null check (operation in ('insert', 'update', 'delete', 'approval_request')),
  payload jsonb not null,
  submitted_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  business_id uuid,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  updated_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  created_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  reviewed_at bigint,
  reviewed_by uuid references auth.users(id)
);

-- Add compatible columns for older existing tables.
alter table public.staging_review_queue add column if not exists source_table text;
alter table public.staging_review_queue add column if not exists source_record_id text;
alter table public.staging_review_queue add column if not exists submitted_by uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.staging_review_queue add column if not exists business_id uuid;
alter table public.staging_review_queue add column if not exists updated_at bigint default ((extract(epoch from now()) * 1000)::bigint);
alter table public.staging_review_queue add column if not exists created_at bigint default ((extract(epoch from now()) * 1000)::bigint);
alter table public.staging_review_queue add column if not exists reviewed_at bigint;
alter table public.staging_review_queue add column if not exists reviewed_by uuid references auth.users(id);

-- Convert timestamp columns from older setup to app-compatible millisecond values.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_review_queue'
      and column_name = 'updated_at'
      and data_type = 'timestamp with time zone'
  ) then
    execute 'alter table public.staging_review_queue alter column updated_at drop default';
    execute 'alter table public.staging_review_queue alter column updated_at type bigint using (extract(epoch from updated_at) * 1000)::bigint';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_review_queue'
      and column_name = 'created_at'
      and data_type = 'timestamp with time zone'
  ) then
    execute 'alter table public.staging_review_queue alter column created_at drop default';
    execute 'alter table public.staging_review_queue alter column created_at type bigint using (extract(epoch from created_at) * 1000)::bigint';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_review_queue'
      and column_name = 'reviewed_at'
      and data_type = 'timestamp with time zone'
  ) then
    execute 'alter table public.staging_review_queue alter column reviewed_at drop default';
    execute 'alter table public.staging_review_queue alter column reviewed_at type bigint using (extract(epoch from reviewed_at) * 1000)::bigint';
  end if;
end $$;

alter table public.staging_review_queue
  alter column updated_at set default ((extract(epoch from now()) * 1000)::bigint),
  alter column created_at set default ((extract(epoch from now()) * 1000)::bigint);

alter table public.staging_review_queue
  alter column business_id set default public.current_user_business_id();

update public.staging_review_queue queue
set business_id = coalesce(queue.business_id, profile.business_id, profile.id)
from public.users profile
where queue.submitted_by = profile.id
  and queue.business_id is null;

-- Make older column names optional if the table was created from the previous script.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_review_queue'
      and column_name = 'table_name'
  ) then
    execute 'alter table public.staging_review_queue alter column table_name drop not null';
    execute 'update public.staging_review_queue set source_table = coalesce(source_table, table_name)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_review_queue'
      and column_name = 'record_id'
  ) then
    execute 'alter table public.staging_review_queue alter column record_id drop not null';
    execute 'update public.staging_review_queue set source_record_id = coalesce(source_record_id, record_id)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_review_queue'
      and column_name = 'submitted_by'
  ) then
    execute 'alter table public.staging_review_queue alter column submitted_by set default auth.uid()';
  end if;
end $$;

create index if not exists idx_staging_review_queue_status on public.staging_review_queue(status);
create index if not exists idx_staging_review_queue_submitted_by on public.staging_review_queue(submitted_by);
create index if not exists idx_staging_review_queue_business_id on public.staging_review_queue(business_id);

alter table public.staging_review_queue enable row level security;

drop policy if exists "Employees can submit for approval" on public.staging_review_queue;
drop policy if exists "Users can read own approval requests" on public.staging_review_queue;
drop policy if exists "Owners can review their business approvals" on public.staging_review_queue;
drop policy if exists "Owners can update approval status" on public.staging_review_queue;

create policy "Employees can submit for approval"
on public.staging_review_queue
for insert
to authenticated
with check (auth.uid() = submitted_by);

create policy "Users can read own approval requests"
on public.staging_review_queue
for select
to authenticated
using (auth.uid() = submitted_by);

create policy "Owners can review their business approvals"
on public.staging_review_queue
for select
to authenticated
using (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() is not null
  and public.current_user_business_id() = business_id
);

create policy "Owners can update approval status"
on public.staging_review_queue
for update
to authenticated
using (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() is not null
  and public.current_user_business_id() = business_id
)
with check (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() is not null
  and public.current_user_business_id() = business_id
);

-- 4. Millisecond updated_at trigger.
create or replace function public.set_updated_at_ms()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = (extract(epoch from now()) * 1000)::bigint;
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
drop trigger if exists trg_users_updated_at_ms on public.users;

create trigger trg_users_updated_at_ms
before update on public.users
for each row
execute function public.set_updated_at_ms();

drop trigger if exists trg_staging_review_queue_updated_at_ms on public.staging_review_queue;

create trigger trg_staging_review_queue_updated_at_ms
before update on public.staging_review_queue
for each row
execute function public.set_updated_at_ms();
