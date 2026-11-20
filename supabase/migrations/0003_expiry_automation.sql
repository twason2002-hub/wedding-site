-- Expiry automation:
-- 1) Daily: mark published websites past expires_at as 'expired'
--    (public access already blocked by RLS the moment expires_at passes).
-- 2) Daily: invoke cleanup edge function which hard-deletes websites
--    past their retention window (app_settings.retention_days, default 30)
--    including Storage files. Soft-deleted sites are purged on the same window.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'expire-wedding-websites',
  '0 3 * * *',
  $$select public.expire_wedding_websites()$$
);

select cron.schedule(
  'purge-expired-websites',
  '15 3 * * *',
  $$
  select net.http_post(
    url := 'https://ichhggatsycxnnxunbrq.supabase.co/functions/v1/cleanup-expired-websites',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cleanup-secret', (select value #>> '{}' from public.app_settings where key = 'cleanup_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
