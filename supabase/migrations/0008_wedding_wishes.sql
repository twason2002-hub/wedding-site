-- Guestbook wishes: guests post well-wishes on live invitation sites.
-- Mirrors the wedding_rsvps RLS pattern (public insert + public read scoped
-- to live sites, admins manage).

create table public.wedding_wishes (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.wedding_websites (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 60),
  message text not null check (char_length(message) between 2 and 280),
  created_at timestamptz not null default now()
);

create index wedding_wishes_website_idx on public.wedding_wishes (website_id, created_at desc);

create policy "guests post wishes" on public.wedding_wishes
  for insert to anon, authenticated
  with check (
    exists (select 1 from public.wedding_websites w
            where w.id = website_id
              and public.wedding_is_public(w))
  );

create policy "public read wishes" on public.wedding_wishes
  for select using (
    exists (select 1 from public.wedding_websites w
            where w.id = website_id
              and public.wedding_is_public(w))
  );

create policy "admins manage wishes" on public.wedding_wishes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
