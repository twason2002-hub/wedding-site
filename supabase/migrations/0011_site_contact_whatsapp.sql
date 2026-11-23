-- Move the public Inviteo WhatsApp default off the previous number.
-- Leaves a number an admin already changed in app_settings untouched.
-- Fresh databases pick up 919056314930 from 0010_site_contact.sql.

update public.app_settings
set value = jsonb_set(value, '{whatsappNumber}', '"919056314930"'::jsonb)
where key = 'site_contact'
  and value->>'whatsappNumber' = '919582915979';
