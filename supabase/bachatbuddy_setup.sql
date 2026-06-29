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

create or replace function public.is_business_member(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users current_profile
    join public.users target_profile
      on coalesce(target_profile.business_id, target_profile.id) = coalesce(current_profile.business_id, current_profile.id)
    where current_profile.id = auth.uid()
      and target_profile.id = p_user_id
  );
$$;

grant execute on function public.is_business_member(uuid) to authenticated;

-- 2. Local-first business sync tables.
create table if not exists public.customers (
  id uuid primary key,
  created_by_id uuid references public.users(id) on delete set null,
  last_updated_by_id uuid references public.users(id) on delete set null,
  name text not null,
  phone text,
  email text,
  address text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  total_purchases double precision not null default 0,
  pending_dues double precision not null default 0,
  total_orders integer not null default 0,
  img text,
  last_purchase_date bigint,
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

create table if not exists public.suppliers (
  id uuid primary key,
  created_by_id uuid references public.users(id) on delete set null,
  last_updated_by_id uuid references public.users(id) on delete set null,
  name text not null,
  phone text,
  email text,
  address text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  supplied_products integer not null default 0,
  total_supply_value double precision not null default 0,
  img text,
  last_supplied_date bigint,
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

create table if not exists public.employees (
  id uuid primary key,
  business_id uuid references public.users(id) on delete cascade,
  business_name text,
  name text not null,
  phone text,
  business_phone text,
  email text not null,
  business_email text,
  role text not null default 'employee' check (role = 'employee'),
  username text not null,
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

create table if not exists public.products (
  id uuid primary key,
  created_by_id uuid references public.users(id) on delete set null,
  last_updated_by_id uuid references public.users(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  name text not null,
  purchase_price double precision not null default 0,
  min_selling_price double precision not null default 0,
  max_selling_price double precision not null default 0,
  quantity integer not null default 0,
  minimum_quantity integer not null default 0,
  status text not null default 'Out of Stock' check (status in ('In Stock', 'Low Stock', 'Out of Stock')),
  added_stock integer not null default 0,
  sold_stock integer not null default 0,
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

create table if not exists public.invoices (
  id uuid primary key,
  created_by_id uuid references public.users(id) on delete set null,
  last_updated_by_id uuid references public.users(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  invoice_number text not null,
  subtotal double precision not null default 0,
  discount double precision not null default 0,
  discount_amount double precision not null default 0,
  total_amount double precision not null default 0,
  paid_amount double precision not null default 0,
  remaining_amount double precision not null default 0,
  total_items integer not null default 0,
  status text not null default 'Unpaid' check (status in ('Paid', 'Pending', 'Unpaid')),
  due_date bigint,
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

create table if not exists public.invoice_items (
  id uuid primary key,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null default 0,
  purchase_price double precision not null default 0,
  selling_price double precision not null default 0,
  subtotal double precision not null default 0,
  profit double precision not null default 0,
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

create index if not exists idx_customers_name on public.customers(name);
create index if not exists idx_customers_status on public.customers(status);
create index if not exists idx_customers_created_by_id on public.customers(created_by_id);
create index if not exists idx_customers_sync_status on public.customers(sync_status);

create index if not exists idx_suppliers_name on public.suppliers(name);
create index if not exists idx_suppliers_status on public.suppliers(status);
create index if not exists idx_suppliers_created_by_id on public.suppliers(created_by_id);
create index if not exists idx_suppliers_sync_status on public.suppliers(sync_status);

create index if not exists idx_employees_business_id on public.employees(business_id);
create index if not exists idx_employees_email on public.employees(email);
create index if not exists idx_employees_username on public.employees(username);
create index if not exists idx_employees_status on public.employees(status);
create index if not exists idx_employees_sync_status on public.employees(sync_status);

create index if not exists idx_products_name on public.products(name);
create index if not exists idx_products_supplier_id on public.products(supplier_id);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_created_by_id on public.products(created_by_id);
create index if not exists idx_products_sync_status on public.products(sync_status);

create index if not exists idx_invoices_customer_id on public.invoices(customer_id);
create index if not exists idx_invoices_invoice_number on public.invoices(invoice_number);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_created_by_id on public.invoices(created_by_id);
create index if not exists idx_invoices_sync_status on public.invoices(sync_status);

create index if not exists idx_invoice_items_invoice_id on public.invoice_items(invoice_id);
create index if not exists idx_invoice_items_product_id on public.invoice_items(product_id);
create index if not exists idx_invoice_items_sync_status on public.invoice_items(sync_status);

alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.employees enable row level security;
alter table public.products enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

drop policy if exists "Business members can read customers" on public.customers;
drop policy if exists "Business members can insert customers" on public.customers;
drop policy if exists "Business members can update customers" on public.customers;
drop policy if exists "Business members can delete customers" on public.customers;

create policy "Business members can read customers"
on public.customers
for select
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can insert customers"
on public.customers
for insert
to authenticated
with check (public.is_business_member(created_by_id) or created_by_id = auth.uid());

create policy "Business members can update customers"
on public.customers
for update
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id))
with check (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can delete customers"
on public.customers
for delete
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

drop policy if exists "Business members can read suppliers" on public.suppliers;
drop policy if exists "Business members can insert suppliers" on public.suppliers;
drop policy if exists "Business members can update suppliers" on public.suppliers;
drop policy if exists "Business members can delete suppliers" on public.suppliers;

create policy "Business members can read suppliers"
on public.suppliers
for select
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can insert suppliers"
on public.suppliers
for insert
to authenticated
with check (public.is_business_member(created_by_id) or created_by_id = auth.uid());

create policy "Business members can update suppliers"
on public.suppliers
for update
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id))
with check (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can delete suppliers"
on public.suppliers
for delete
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

drop policy if exists "Owners can read employees" on public.employees;
drop policy if exists "Owners can insert employees" on public.employees;
drop policy if exists "Owners can update employees" on public.employees;
drop policy if exists "Owners can delete employees" on public.employees;

create policy "Owners can read employees"
on public.employees
for select
to authenticated
using (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() = business_id
);

create policy "Owners can insert employees"
on public.employees
for insert
to authenticated
with check (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() = business_id
);

create policy "Owners can update employees"
on public.employees
for update
to authenticated
using (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() = business_id
)
with check (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() = business_id
);

create policy "Owners can delete employees"
on public.employees
for delete
to authenticated
using (
  public.current_user_role() = 'owner'
  and public.current_user_business_id() = business_id
);

drop policy if exists "Business members can read products" on public.products;
drop policy if exists "Business members can insert products" on public.products;
drop policy if exists "Business members can update products" on public.products;
drop policy if exists "Business members can delete products" on public.products;

create policy "Business members can read products"
on public.products
for select
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can insert products"
on public.products
for insert
to authenticated
with check (public.is_business_member(created_by_id) or created_by_id = auth.uid());

create policy "Business members can update products"
on public.products
for update
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id))
with check (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can delete products"
on public.products
for delete
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

drop policy if exists "Business members can read invoices" on public.invoices;
drop policy if exists "Business members can insert invoices" on public.invoices;
drop policy if exists "Business members can update invoices" on public.invoices;
drop policy if exists "Business members can delete invoices" on public.invoices;

create policy "Business members can read invoices"
on public.invoices
for select
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can insert invoices"
on public.invoices
for insert
to authenticated
with check (public.is_business_member(created_by_id) or created_by_id = auth.uid());

create policy "Business members can update invoices"
on public.invoices
for update
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id))
with check (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

create policy "Business members can delete invoices"
on public.invoices
for delete
to authenticated
using (public.is_business_member(created_by_id) or public.is_business_member(last_updated_by_id));

drop policy if exists "Business members can read invoice items" on public.invoice_items;
drop policy if exists "Business members can insert invoice items" on public.invoice_items;
drop policy if exists "Business members can update invoice items" on public.invoice_items;
drop policy if exists "Business members can delete invoice items" on public.invoice_items;

create policy "Business members can read invoice items"
on public.invoice_items
for select
to authenticated
using (
  exists (
    select 1
    from public.invoices invoice
    where invoice.id = invoice_items.invoice_id
      and (public.is_business_member(invoice.created_by_id) or public.is_business_member(invoice.last_updated_by_id))
  )
);

create policy "Business members can insert invoice items"
on public.invoice_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.invoices invoice
    where invoice.id = invoice_items.invoice_id
      and (public.is_business_member(invoice.created_by_id) or public.is_business_member(invoice.last_updated_by_id))
  )
);

create policy "Business members can update invoice items"
on public.invoice_items
for update
to authenticated
using (
  exists (
    select 1
    from public.invoices invoice
    where invoice.id = invoice_items.invoice_id
      and (public.is_business_member(invoice.created_by_id) or public.is_business_member(invoice.last_updated_by_id))
  )
)
with check (
  exists (
    select 1
    from public.invoices invoice
    where invoice.id = invoice_items.invoice_id
      and (public.is_business_member(invoice.created_by_id) or public.is_business_member(invoice.last_updated_by_id))
  )
);

create policy "Business members can delete invoice items"
on public.invoice_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.invoices invoice
    where invoice.id = invoice_items.invoice_id
      and (public.is_business_member(invoice.created_by_id) or public.is_business_member(invoice.last_updated_by_id))
  )
);

-- 3. Username lookup RPC used before sign-in.
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

-- 4. Staging review queue for employee approval workflow.
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

-- 5. Millisecond updated_at trigger.
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

drop trigger if exists trg_customers_updated_at_ms on public.customers;
drop trigger if exists trg_suppliers_updated_at_ms on public.suppliers;
drop trigger if exists trg_employees_updated_at_ms on public.employees;
drop trigger if exists trg_products_updated_at_ms on public.products;
drop trigger if exists trg_invoices_updated_at_ms on public.invoices;
drop trigger if exists trg_invoice_items_updated_at_ms on public.invoice_items;

create trigger trg_customers_updated_at_ms
before update on public.customers
for each row
execute function public.set_updated_at_ms();

create trigger trg_suppliers_updated_at_ms
before update on public.suppliers
for each row
execute function public.set_updated_at_ms();

create trigger trg_employees_updated_at_ms
before update on public.employees
for each row
execute function public.set_updated_at_ms();

create trigger trg_products_updated_at_ms
before update on public.products
for each row
execute function public.set_updated_at_ms();

create trigger trg_invoices_updated_at_ms
before update on public.invoices
for each row
execute function public.set_updated_at_ms();

create trigger trg_invoice_items_updated_at_ms
before update on public.invoice_items
for each row
execute function public.set_updated_at_ms();

drop trigger if exists trg_staging_review_queue_updated_at_ms on public.staging_review_queue;

create trigger trg_staging_review_queue_updated_at_ms
before update on public.staging_review_queue
for each row
execute function public.set_updated_at_ms();

-- 6. Supabase Storage for synced application images.
-- SQLite remains the local source of truth; the app uploads local image URIs here
-- during background sync and stores the resulting public URL in cloud rows.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bachatbuddy-media',
  'bachatbuddy-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read BachatBuddy media" on storage.objects;
drop policy if exists "Authenticated users can upload BachatBuddy media" on storage.objects;
drop policy if exists "Authenticated users can update BachatBuddy media" on storage.objects;
drop policy if exists "Authenticated users can delete BachatBuddy media" on storage.objects;

create policy "Public can read BachatBuddy media"
on storage.objects
for select
to public
using (bucket_id = 'bachatbuddy-media');

create policy "Authenticated users can upload BachatBuddy media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'bachatbuddy-media');

create policy "Authenticated users can update BachatBuddy media"
on storage.objects
for update
to authenticated
using (bucket_id = 'bachatbuddy-media')
with check (bucket_id = 'bachatbuddy-media');

create policy "Authenticated users can delete BachatBuddy media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'bachatbuddy-media');
