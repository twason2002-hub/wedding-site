-- Marketing contact, editable in admin. Safe for anonymous read:
-- no secrets, and every other app_settings key stays admin-only.

insert into public.app_settings (key, value)
values (
  'site_contact',
  '{"whatsappNumber":"919056314930","email":"","instagramUrl":""}'::jsonb
)
on conflict (key) do nothing;

create policy "public read site contact" on public.app_settings
  for select
  to anon, authenticated
  using (key = 'site_contact');
