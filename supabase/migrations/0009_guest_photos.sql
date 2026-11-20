-- Guest photo uploads: moderated (approved=false until the couple approves
-- in admin). Public can read APPROVED photos on live sites only.

create table public.wedding_guest_photos (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.wedding_websites (id) on delete cascade,
  storage_path text not null,
  caption text check (caption is null or char_length(caption) <= 120),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index wedding_guest_photos_website_idx on public.wedding_guest_photos (website_id, created_at desc);

create policy "guests upload photo rows" on public.wedding_guest_photos
  for insert to anon, authenticated
  with check (
    exists (select 1 from public.wedding_websites w
            where w.id = website_id
              and public.wedding_is_public(w))
  );

create policy "public read approved guest photos" on public.wedding_guest_photos
  for select using (
    approved
    and exists (select 1 from public.wedding_websites w
            where w.id = website_id
              and public.wedding_is_public(w))
  );

create policy "admins manage guest photos" on public.wedding_guest_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for guest uploads (public read, anon insert scoped to a
-- live website slug folder: <slug>/<uuid>.jpg).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guest-photos', 'guest-photos', true, 8388608,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "guest photos public read" on storage.objects
  for select using (bucket_id = 'guest-photos');

create policy "guests upload guest photos" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'guest-photos'
    and exists (select 1 from public.wedding_websites w
            where w.slug = split_part(name, '/', 1)
              and public.wedding_is_public(w))
  );

create policy "admins delete guest photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'guest-photos' and public.is_admin());
