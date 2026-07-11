-- Scent Forest Supabase setup
-- Run this in your Supabase SQL Editor for the new project.
-- After creating your superadmin auth user, run the private superadmin insert near the end.

create extension if not exists pgcrypto;
create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  category text not null check (category in ('men', 'women', 'elevate', '100ml')),
  product_tag text check (product_tag is null or product_tag in ('top_seller', 'featured', 'trending', 'new_arrival')),
  photo text,
  image_path text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  "deviceId" text,
  "userId" uuid not null references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique ("userId")
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  firstname text not null,
  lastname text,
  phone text not null,
  address text not null,
  city text,
  postalcode text,
  country text,
  payment_method text not null default 'COD',
  total numeric(12, 2) not null check (total >= 0),
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists private.superadmins (
  email text primary key,
  created_at timestamptz not null default now()
);

revoke all on private.superadmins from public, anon, authenticated;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(nullif(excluded.name, ''), public.profiles.name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.superadmins
    where lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_superadmin();
$$;

grant execute on function public.is_superadmin() to authenticated;
grant execute on function public.is_admin() to authenticated;

update public.profiles
set role = 'user'
where role = 'admin';

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contacts enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.products from anon, authenticated;
revoke all on public.carts from anon, authenticated;
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
revoke all on public.contacts from anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

grant select, insert on public.profiles to authenticated;
grant update (name, avatar_url) on public.profiles to authenticated;

grant select, insert, update, delete on public.carts to authenticated;
grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant update, delete on public.orders to authenticated;
grant delete on public.order_items to authenticated;
grant insert on public.contacts to authenticated;
grant select, update, delete on public.contacts to authenticated;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products for insert
to authenticated
with check (public.is_admin());

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
on public.products for delete
to authenticated
using (public.is_admin());

drop policy if exists "profiles_owner_or_admin_read" on public.profiles;
create policy "profiles_owner_or_admin_read"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or public.is_admin());

drop policy if exists "profiles_owner_insert" on public.profiles;
create policy "profiles_owner_insert"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id and role = 'user');

drop policy if exists "profiles_owner_update_safe_columns" on public.profiles;
create policy "profiles_owner_update_safe_columns"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "carts_owner_all" on public.carts;
create policy "carts_owner_all"
on public.carts for all
to authenticated
using ((select auth.uid()) = "userId")
with check ((select auth.uid()) = "userId");

drop policy if exists "orders_owner_insert" on public.orders;
create policy "orders_owner_insert"
on public.orders for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "orders_owner_read" on public.orders;
create policy "orders_owner_read"
on public.orders for select
to authenticated
using ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete"
on public.orders for delete
to authenticated
using (public.is_admin());

drop policy if exists "order_items_owner_insert" on public.order_items;
create policy "order_items_owner_insert"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "order_items_owner_or_admin_read" on public.order_items;
create policy "order_items_owner_or_admin_read"
on public.order_items for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "order_items_admin_delete" on public.order_items;
create policy "order_items_admin_delete"
on public.order_items for delete
to authenticated
using (public.is_admin());

drop policy if exists "contacts_authenticated_insert" on public.contacts;
create policy "contacts_authenticated_insert"
on public.contacts for insert
to authenticated
with check (true);

drop policy if exists "contacts_admin_manage" on public.contacts;
create policy "contacts_admin_manage"
on public.contacts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('products', 'products', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "products_bucket_public_read" on storage.objects;
create policy "products_bucket_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'products');

drop policy if exists "products_bucket_admin_insert" on storage.objects;
create policy "products_bucket_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products' and public.is_admin());

drop policy if exists "products_bucket_admin_update" on storage.objects;
create policy "products_bucket_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'products' and public.is_admin())
with check (bucket_id = 'products' and public.is_admin());

drop policy if exists "products_bucket_admin_delete" on storage.objects;
create policy "products_bucket_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'products' and public.is_admin());

drop policy if exists "avatars_bucket_public_read" on storage.objects;
create policy "avatars_bucket_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');

drop policy if exists "avatars_bucket_owner_insert" on storage.objects;
create policy "avatars_bucket_owner_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars' and owner = (select auth.uid()));

drop policy if exists "avatars_bucket_owner_update" on storage.objects;
create policy "avatars_bucket_owner_update"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and owner = (select auth.uid()))
with check (bucket_id = 'avatars' and owner = (select auth.uid()));

drop policy if exists "avatars_bucket_owner_delete" on storage.objects;
create policy "avatars_bucket_owner_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and owner = (select auth.uid()));

-- Run this after your superadmin user exists in Supabase Auth.
-- Replace the email and execute it once. This value is stored in a private schema,
-- not in public profiles and not in frontend env vars.
-- insert into private.superadmins (email)
-- values ('YOUR_SUPERADMIN_EMAIL@example.com')
-- on conflict (email) do nothing;
