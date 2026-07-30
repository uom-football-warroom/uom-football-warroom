-- Automatically create a public UserProfile whenever
-- Supabase Auth creates a new auth.users record.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
  base_username text;
  final_username text;
  final_display_name text;
  username_suffix text;
  attempt_number integer := 0;
begin
  -- Read the metadata sent by supabase.auth.signUp().
  requested_username :=
    left(
      btrim(
        coalesce(
          new.raw_user_meta_data ->> 'username',
          ''
        )
      ),
      30
    );

  -- Use the requested username when available.
  -- Otherwise generate one from the Supabase Auth UUID.
  base_username :=
    case
      when requested_username <> '' then
        requested_username
      else
        'user_' ||
        substr(
          replace(new.id::text, '-', ''),
          1,
          12
        )
    end;

  final_username := left(base_username, 30);

  -- Use display_name metadata when available.
  -- Otherwise fall back to the username or "Supporter".
  final_display_name :=
    left(
      coalesce(
        nullif(
          btrim(
            coalesce(
              new.raw_user_meta_data ->> 'display_name',
              ''
            )
          ),
          ''
        ),
        nullif(requested_username, ''),
        'Supporter'
      ),
      80
    );

  /*
   * Insert the public profile.
   *
   * If another account already uses the requested username,
   * retry with a UUID-based suffix.
   */
  loop
    begin
      insert into public.user_profiles (
        id,
        username,
        display_name,
        created_at,
        updated_at
      )
      values (
        new.id,
        final_username,
        final_display_name,
        now(),
        now()
      )
      on conflict (id) do nothing;

      return new;

    exception
      when unique_violation then
        attempt_number := attempt_number + 1;

        if attempt_number > 10 then
          raise exception
            'Unable to generate a unique username for Auth user %',
            new.id;
        end if;

        username_suffix :=
          '_' ||
          substr(
            md5(
              new.id::text ||
              ':' ||
              attempt_number::text
            ),
            1,
            8
          );

        -- 21 characters + "_" + 8 characters = 30.
        final_username :=
          left(base_username, 21) ||
          username_suffix;
    end;
  end loop;
end;
$$;

/*
 * Prisma migrate dev replays migrations inside a shadow database.
 *
 * Prisma's shadow database does not contain Supabase's managed
 * auth.users table, so trigger creation is skipped there.
 *
 * The real Supabase database contains auth.users, so the trigger
 * will be created when this migration is applied to Supabase.
 */
do $$
begin
  if to_regclass('auth.users') is not null then
    execute
      'drop trigger if exists on_auth_user_created on auth.users';

    execute
      'create trigger on_auth_user_created
       after insert on auth.users
       for each row
       execute function public.handle_new_auth_user()';
  end if;
end;
$$;