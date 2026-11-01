create extension if not exists pgcrypto;

do $$ begin
  create type public.portal_role as enum ('admin', 'client');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.organization_status as enum ('active', 'paused');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.portal_role not null default 'client',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  segment text not null default '',
  logo_url text not null default '',
  accent_color text not null default '#6B4A7D' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  status public.organization_status not null default 'active',
  modules jsonb not null default '{"overview":true,"sales":true,"marketing":true,"goals":true,"content":true,"reports":true,"requests":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null default 'viewer' check (role in ('client_admin', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

create table if not exists public.dashboard_content (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.client_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  message text not null check (char_length(message) between 2 and 1500),
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists organizations_touch_updated_at on public.organizations;
create trigger organizations_touch_updated_at before update on public.organizations for each row execute function public.touch_updated_at();
drop trigger if exists dashboard_touch_updated_at on public.dashboard_content;
create trigger dashboard_touch_updated_at before update on public.dashboard_content for each row execute function public.touch_updated_at();
drop trigger if exists requests_touch_updated_at on public.client_requests;
create trigger requests_touch_updated_at before update on public.client_requests for each row execute function public.touch_updated_at();

create or replace function public.handle_new_portal_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert or update of email on auth.users for each row execute function public.handle_new_portal_user();

create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active = true
  );
$$;

create or replace function public.has_organization_access(target_organization uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.is_portal_admin() or exists (
    select 1
    from public.memberships m
    join public.profiles p on p.id = m.user_id
    where m.user_id = auth.uid()
      and m.organization_id = target_organization
      and p.active = true
  );
$$;

revoke all on function public.is_portal_admin() from public;
revoke all on function public.has_organization_access(uuid) from public;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.has_organization_access(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.dashboard_content enable row level security;
alter table public.client_requests enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated using (id = auth.uid() or public.is_portal_admin());
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles for update to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());

drop policy if exists "organizations_select" on public.organizations;
create policy "organizations_select" on public.organizations for select to authenticated using (public.has_organization_access(id));
drop policy if exists "organizations_admin_insert" on public.organizations;
create policy "organizations_admin_insert" on public.organizations for insert to authenticated with check (public.is_portal_admin());
drop policy if exists "organizations_admin_update" on public.organizations;
create policy "organizations_admin_update" on public.organizations for update to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());
drop policy if exists "organizations_admin_delete" on public.organizations;
create policy "organizations_admin_delete" on public.organizations for delete to authenticated using (public.is_portal_admin());

drop policy if exists "memberships_select" on public.memberships;
create policy "memberships_select" on public.memberships for select to authenticated using (user_id = auth.uid() or public.is_portal_admin());
drop policy if exists "memberships_admin_all" on public.memberships;
create policy "memberships_admin_all" on public.memberships for all to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());

drop policy if exists "dashboard_select" on public.dashboard_content;
create policy "dashboard_select" on public.dashboard_content for select to authenticated using (public.has_organization_access(organization_id));
drop policy if exists "dashboard_admin_all" on public.dashboard_content;
create policy "dashboard_admin_all" on public.dashboard_content for all to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());

drop policy if exists "requests_select" on public.client_requests;
create policy "requests_select" on public.client_requests for select to authenticated using (public.has_organization_access(organization_id));
drop policy if exists "requests_client_insert" on public.client_requests;
create policy "requests_client_insert" on public.client_requests for insert to authenticated with check (created_by = auth.uid() and public.has_organization_access(organization_id));
drop policy if exists "requests_admin_update" on public.client_requests;
create policy "requests_admin_update" on public.client_requests for update to authenticated using (public.is_portal_admin()) with check (public.is_portal_admin());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.memberships to authenticated;
grant select, insert, update, delete on public.dashboard_content to authenticated;
grant select, insert, update on public.client_requests to authenticated;
