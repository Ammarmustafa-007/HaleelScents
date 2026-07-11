# Supabase Migration And Security Audit

## What To Change For Your Supabase Project

1. Create a new Supabase project.
2. Run `supabase_setup.sql` in the Supabase SQL Editor.
3. Create/sign up your superadmin user.
4. Run the final private superadmin insert from `supabase_setup.sql` with your superadmin email.
5. Replace local `.env` values with your project URL and anon key.
6. In Supabase Auth URL settings, set the app URL and password reset redirect URL for your deployed site, not `localhost`.

## Required Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEOAPIKEY=your-geoapify-browser-key
```

Do not commit real `.env` values.

## Critical Findings

- `ecomapi/password.txt` contains a Supabase database password and project URL. Rotate the exposed Supabase password and remove this file from git.
- `.env` is tracked by git and contains live credentials/config. Keep `.env.example`, but untrack `.env`.
- Admin authorization must not rely on React routes. The setup script enforces admin-only product/order/contact management through RLS.
- The old cart model used a browser-generated `deviceId` as ownership. That is guessable/copyable client state, so the client was changed to use the authenticated Supabase user ID.
- Signup was creating profiles twice, and `AuthContext.signUp` referenced an undefined `name`. The database trigger now creates profiles.
- Superadmin is static and hidden from public app data. It is stored in `private.superadmins`, checked through `public.is_superadmin()`, and not exposed through `profiles.role` or frontend env vars.

## Superadmin Setup

After the superadmin account exists in Supabase Auth, run this in the SQL Editor:

```sql
insert into private.superadmins (email)
values ('YOUR_SUPERADMIN_EMAIL@example.com')
on conflict (email) do nothing;
```

Do not put this email/password in `.env`, React code, or `profiles.role`. The frontend only calls `rpc('is_superadmin')`, which returns `true` or `false`.

## CRUD/RLS Summary

- `products`: public read; superadmin-only insert/update/delete.
- `profiles`: user can read self; superadmin can read all; user can update only safe profile columns through grants.
- `carts`: authenticated user can manage only their own cart.
- `orders`: user can create/read own orders; superadmin can read/update/delete all orders.
- `order_items`: user can insert/read items only for their own orders; superadmin can read/delete all.
- `contacts`: authenticated users can submit; superadmin can manage.
- `products` storage bucket: public read; superadmin-only write/delete.
- `avatars` storage bucket: public read; owner-only write/update/delete.

## Code Issues Still Worth Cleaning Up

- `npm audit` reports critical/high dependency vulnerabilities. Run `npm audit fix`, then manually review `jspdf` because its fix may require a breaking upgrade.
- `npm run lint` still fails on older style/React-refresh issues outside the Supabase migration path.
- Several files still contain noisy `console.log` calls that can leak order/customer data in production.
- Password reset redirect is hard-coded to `http://localhost:5173/update-password`; move this to an env var before deployment.
- Remove unused Clerk dependency if Supabase Auth is the only auth provider.

## Git Cleanup Commands

Run these after confirming you do not need the committed secret files:

```sh
git rm --cached .env ecomapi/password.txt
```

Then rotate the old Supabase credentials from the Supabase dashboard. Removing files from the current commit is not enough if this repo has been pushed; purge or invalidate any exposed secrets.
