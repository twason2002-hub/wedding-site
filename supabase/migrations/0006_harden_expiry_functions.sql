-- Harden expiry functions flagged by the Supabase security advisor.

-- set_wedding_expiry: no table references, so an empty search_path is safe.
alter function public.set_wedding_expiry() set search_path = '';

-- expire_wedding_websites is SECURITY DEFINER and only needs to run from
-- pg_cron / service role. Remove the implicit PUBLIC grant so anon and
-- authenticated users cannot trigger a sweep via /rest/v1/rpc.
revoke execute on function public.expire_wedding_websites() from public, anon, authenticated;
grant execute on function public.expire_wedding_websites() to service_role;
