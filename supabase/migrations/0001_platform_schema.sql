-- Inviteo wedding platform schema
-- Tables: admin_users, templates, wedding_websites, wedding_content,
--         wedding_images, wedding_rsvps (future-ready), app_settings
-- Storage: wedding-images bucket. RLS everywhere.

create extension if not exists pgcrypto;

-- ---------- admin_users ----------
create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

create or replace function public.is_owner()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner');
$$;

-- ---------- templates ----------
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null default '',
  thumbnail text not null default '',
  fonts jsonb not null default '{}',
  palette jsonb not null default '{}',
  sections jsonb not null default '[]',
  animation text not null default 'fade',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- wedding_websites ----------
create table public.wedding_websites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 80),
  template_id uuid not null references public.templates (id),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'expired', 'deleted')),
  bride_name text not null default '',
  groom_name text not null default '',
  wedding_date date,
  expiry_days integer not null default 7 check (expiry_days between 1 and 365),
  custom_expires_at timestamptz,
  expires_at timestamptz,
  rsvp_enabled boolean not null default false,
  locale_default text not null default 'en' check (locale_default in ('en', 'hi')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  deleted_at timestamptz
);

create index wedding_websites_status_expiry_idx on public.wedding_websites (status, expires_at);
create index wedding_websites_template_idx on public.wedding_websites (template_id);

-- expires_at = custom override, else wedding_date + expiry_days (midnight).
create or replace function public.set_wedding_expiry()
returns trigger
language plpgsql
as $$
begin
  new.expires_at := coalesce(
    new.custom_expires_at,
    (new.wedding_date + new.expiry_days)::timestamptz
  );
  new.updated_at := now();
  if new.status = 'published' and old.status is distinct from 'published' then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger wedding_websites_expiry
  before insert or update on public.wedding_websites
  for each row execute function public.set_wedding_expiry();

-- ---------- wedding_content ----------
-- Key/value JSONB document per website. Keys mirror WeddingData fields:
-- couple, events, venue, contacts, sections, hashtag, music, blessing,
-- blessingHi, mantra, videoUrl.
create table public.wedding_content (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.wedding_websites (id) on delete cascade,
  key text not null,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  unique (website_id, key)
);

-- ---------- wedding_images ----------
-- slot: 'couple' | 'gallery' | 'event:<eventId>'
-- storage_path: Supabase Storage path ('{websiteId}/...') or legacy '/weddings/...' public path.
create table public.wedding_images (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.wedding_websites (id) on delete cascade,
  slot text not null,
  storage_path text not null,
  alt text not null default '',
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (website_id, slot, sort_order)
);

create index wedding_images_website_idx on public.wedding_images (website_id, slot, sort_order);

-- ---------- wedding_rsvps (future-ready, no UI this phase) ----------
create table public.wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.wedding_websites (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  attending boolean not null default true,
  event_ids jsonb not null default '[]',
  guests integer not null default 1 check (guests between 1 and 10),
  diet text check (diet is null or char_length(diet) <= 120),
  message text check (message is null or char_length(message) <= 500),
  created_at timestamptz not null default now()
);

create index wedding_rsvps_website_idx on public.wedding_rsvps (website_id, created_at desc);

-- ---------- app_settings ----------
create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value) values
  ('default_expiry_days', '7'::jsonb),
  ('retention_days', '30'::jsonb),
  ('cleanup_secret', to_jsonb(replace(gen_random_uuid()::text, '-', '')));

-- ---------- public visibility helper ----------
create or replace function public.wedding_is_public(w public.wedding_websites)
returns boolean
language sql stable
as $$
  select w.status = 'published'
     and w.deleted_at is null
     and (w.expires_at is null or w.expires_at > now());
$$;

-- ---------- RLS ----------
alter table public.admin_users enable row level security;
alter table public.templates enable row level security;
alter table public.wedding_websites enable row level security;
alter table public.wedding_content enable row level security;
alter table public.wedding_images enable row level security;
alter table public.wedding_rsvps enable row level security;
alter table public.app_settings enable row level security;

-- admin_users: admins read; owners manage.
create policy "admins read admin_users" on public.admin_users
  for select to authenticated using (public.is_admin());
create policy "owners manage admin_users" on public.admin_users
  for all to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- templates: public metadata; admins manage.
create policy "public read templates" on public.templates
  for select using (true);
create policy "admins manage templates" on public.templates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- wedding_websites: public sees only live published sites; admins see all.
create policy "public read live websites" on public.wedding_websites
  for select using (public.wedding_is_public(wedding_websites));
create policy "admins manage websites" on public.wedding_websites
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- wedding_content / wedding_images: follow parent visibility.
create policy "public read live content" on public.wedding_content
  for select using (
    exists (select 1 from public.wedding_websites w
            where w.id = website_id and public.wedding_is_public(w))
  );
create policy "admins manage content" on public.wedding_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read live images" on public.wedding_images
  for select using (
    exists (select 1 from public.wedding_websites w
            where w.id = website_id and public.wedding_is_public(w))
  );
create policy "admins manage images" on public.wedding_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- wedding_rsvps: guests may submit only to live RSVP-enabled sites; admins read/delete.
create policy "guests submit rsvp" on public.wedding_rsvps
  for insert to anon, authenticated
  with check (
    exists (select 1 from public.wedding_websites w
            where w.id = website_id
              and public.wedding_is_public(w)
              and w.rsvp_enabled)
  );
create policy "admins read rsvps" on public.wedding_rsvps
  for select to authenticated using (public.is_admin());
create policy "admins delete rsvps" on public.wedding_rsvps
  for delete to authenticated using (public.is_admin());

-- app_settings: admins only.
create policy "admins manage settings" on public.app_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-images', 'wedding-images', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "wedding images public read" on storage.objects
  for select using (bucket_id = 'wedding-images');
create policy "admins upload wedding images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'wedding-images' and public.is_admin());
create policy "admins update wedding images" on storage.objects
  for update to authenticated
  using (bucket_id = 'wedding-images' and public.is_admin())
  with check (bucket_id = 'wedding-images' and public.is_admin());
create policy "admins delete wedding images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'wedding-images' and public.is_admin());

-- ---------- expiry marking (called by cron) ----------
create or replace function public.expire_wedding_websites()
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  n integer;
begin
  update public.wedding_websites
     set status = 'expired'
   where status = 'published'
     and expires_at is not null
     and expires_at <= now();
  get diagnostics n = row_count;
  return n;
end;
$$;
