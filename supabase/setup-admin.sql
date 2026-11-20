-- One-time admin bootstrap. Replace the two values below, then run once.
-- Creates a confirmed Supabase Auth user (email/password) + owner row in admin_users.
do $$
declare
  admin_email text := 'admin@inviteo.example';
  admin_password text := 'CHANGE_ME_BEFORE_RUNNING';
  uid uuid;
begin
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    admin_email, extensions.crypt(admin_password, extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
    '', '', '', ''
  )
  returning id into uid;

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), uid, uid::text,
    jsonb_build_object('sub', uid::text, 'email', admin_email, 'email_verified', true),
    'email', now(), now(), now()
  );

  insert into public.admin_users (id, email, role) values (uid, admin_email, 'owner');
end $$;
