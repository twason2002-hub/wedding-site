-- Demo websites must NEVER expire, regardless of cron, admin edits or
-- accidental expiry values. Three guards:
-- 1) The seeded demo slugs are locked to no_expiry = true by the trigger.
-- 2) The expiry cron function skips no_expiry rows entirely.
-- 3) (edge function) purge queries also filter no_expiry = false.

create or replace function public.set_wedding_expiry()
returns trigger
language plpgsql
as $$
begin
  if new.slug in (
    'aarav-diya-royal',
    'kabir-anaya-floral',
    'isha-vihaan-minimal',
    'aditi-rohan-vivah',
    'sara-arjun-goa'
  ) then
    new.no_expiry := true;
  end if;

  if new.no_expiry then
    new.expires_at := null;
  else
    new.expires_at := coalesce(
      new.custom_expires_at,
      (new.wedding_date + new.expiry_days)::timestamptz
    );
  end if;
  new.updated_at := now();
  if new.status = 'published' and old.status is distinct from 'published' then
    new.published_at := now();
  end if;
  return new;
end;
$$;

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
     and no_expiry = false
     and expires_at is not null
     and expires_at <= now();
  get diagnostics n = row_count;
  return n;
end;
$$;

update public.wedding_websites
   set no_expiry = true, expires_at = null
 where slug in (
   'aarav-diya-royal',
   'kabir-anaya-floral',
   'isha-vihaan-minimal',
   'aditi-rohan-vivah',
   'sara-arjun-goa'
 );
