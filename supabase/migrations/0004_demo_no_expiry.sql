-- Demo websites never expire. Adds a persistent no_expiry flag;
-- the expiry trigger returns NULL expires_at when it is set.

alter table public.wedding_websites
  add column if not exists no_expiry boolean not null default false;

create or replace function public.set_wedding_expiry()
returns trigger
language plpgsql
as $$
begin
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

update public.wedding_websites
   set no_expiry = true
 where slug in (
   'aarav-diya-royal',
   'kabir-anaya-floral',
   'isha-vihaan-minimal',
   'aditi-rohan-vivah',
   'sara-arjun-goa'
 );
