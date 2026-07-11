-- Static admin compatibility patch
-- Use this ONLY if you insist on frontend-static admin auth.
--
-- Why this is needed:
-- The static /admin login is local React state, not Supabase Auth.
-- Supabase only sees these requests as the anon role, so RLS blocks admin CRUD.
--
-- Security warning:
-- This permits anyone with the public anon key to call the same admin table APIs.
-- It makes the UI work, but it is not a secure production authorization model.

grant select, insert, update, delete on public.products to anon;
grant select, update, delete on public.orders to anon;
grant select, delete on public.order_items to anon;
grant select, update, delete on public.contacts to anon;

drop policy if exists "static_admin_products_insert" on public.products;
create policy "static_admin_products_insert"
on public.products for insert
to anon
with check (true);

drop policy if exists "static_admin_products_update" on public.products;
create policy "static_admin_products_update"
on public.products for update
to anon
using (true)
with check (true);

drop policy if exists "static_admin_products_delete" on public.products;
create policy "static_admin_products_delete"
on public.products for delete
to anon
using (true);

drop policy if exists "static_admin_orders_read" on public.orders;
create policy "static_admin_orders_read"
on public.orders for select
to anon
using (true);

drop policy if exists "static_admin_orders_update" on public.orders;
create policy "static_admin_orders_update"
on public.orders for update
to anon
using (true)
with check (true);

drop policy if exists "static_admin_orders_delete" on public.orders;
create policy "static_admin_orders_delete"
on public.orders for delete
to anon
using (true);

drop policy if exists "static_admin_order_items_read" on public.order_items;
create policy "static_admin_order_items_read"
on public.order_items for select
to anon
using (true);

drop policy if exists "static_admin_order_items_delete" on public.order_items;
create policy "static_admin_order_items_delete"
on public.order_items for delete
to anon
using (true);

drop policy if exists "static_admin_contacts_manage" on public.contacts;
create policy "static_admin_contacts_manage"
on public.contacts for all
to anon
using (true)
with check (true);

drop policy if exists "static_admin_products_bucket_insert" on storage.objects;
create policy "static_admin_products_bucket_insert"
on storage.objects for insert
to anon
with check (bucket_id = 'products');

drop policy if exists "static_admin_products_bucket_update" on storage.objects;
create policy "static_admin_products_bucket_update"
on storage.objects for update
to anon
using (bucket_id = 'products')
with check (bucket_id = 'products');

drop policy if exists "static_admin_products_bucket_delete" on storage.objects;
create policy "static_admin_products_bucket_delete"
on storage.objects for delete
to anon
using (bucket_id = 'products');
