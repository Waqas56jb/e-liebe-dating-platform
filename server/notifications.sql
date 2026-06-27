-- ============================================================================
--  E-LIEBE — Notification automation
--  Run ONCE in the Supabase SQL editor (same place you ran schema.sql).
--  Creates notifications automatically on match / message / like / view /
--  profile-complete. Functions are SECURITY DEFINER so they may write
--  notifications for the *other* user (bypassing RLS safely).
-- ============================================================================

-- New match → notify BOTH users
create or replace function notify_on_match()
returns trigger language plpgsql security definer set search_path = public as $$
declare na text; nb text;
begin
  select name into na from profiles where id = new.user_a;
  select name into nb from profiles where id = new.user_b;
  insert into notifications (user_id, type, actor_id, body, data) values
    (new.user_a, 'match', new.user_b, 'Du hast ein neues Match mit ' || coalesce(nb,'jemandem') || '! 🎉', jsonb_build_object('matchId', new.id)),
    (new.user_b, 'match', new.user_a, 'Du hast ein neues Match mit ' || coalesce(na,'jemandem') || '! 🎉', jsonb_build_object('matchId', new.id));
  return new;
end; $$;
drop trigger if exists trg_notify_match on matches;
create trigger trg_notify_match after insert on matches
  for each row execute function notify_on_match();

-- New message → notify the recipient
create or replace function notify_on_message()
returns trigger language plpgsql security definer set search_path = public as $$
declare recipient uuid; sender_name text;
begin
  select case when m.user_a = new.sender_id then m.user_b else m.user_a end
    into recipient from matches m where m.id = new.match_id;
  select name into sender_name from profiles where id = new.sender_id;
  if recipient is not null then
    insert into notifications (user_id, type, actor_id, body, data)
    values (recipient, 'message', new.sender_id,
            coalesce(sender_name,'Jemand') || ' hat dir geschrieben.',
            jsonb_build_object('matchId', new.match_id));
  end if;
  return new;
end; $$;
drop trigger if exists trg_notify_message on messages;
create trigger trg_notify_message after insert on messages
  for each row execute function notify_on_message();

-- New like / super-like → notify the liked user
create or replace function notify_on_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare liker_name text;
begin
  if new.action in ('like','superlike') then
    select name into liker_name from profiles where id = new.swiper_id;
    insert into notifications (user_id, type, actor_id, body, data)
    values (new.swipee_id, 'like', new.swiper_id,
            coalesce(liker_name,'Jemand') ||
              (case when new.action = 'superlike' then ' hat dir ein Super‑Like gesendet! ⭐'
                    else ' hat dein Profil geliked. 💗' end),
            jsonb_build_object());
  end if;
  return new;
end; $$;
drop trigger if exists trg_notify_like on swipes;
create trigger trg_notify_like after insert on swipes
  for each row execute function notify_on_like();

-- Profile view → notify the viewed user (fires once per viewer/viewed pair)
create or replace function notify_on_view()
returns trigger language plpgsql security definer set search_path = public as $$
declare viewer_name text;
begin
  select name into viewer_name from profiles where id = new.viewer_id;
  insert into notifications (user_id, type, actor_id, body, data)
  values (new.viewed_id, 'view', new.viewer_id,
          coalesce(viewer_name,'Jemand') || ' hat dein Profil angesehen.',
          jsonb_build_object());
  return new;
end; $$;
drop trigger if exists trg_notify_view on profile_views;
create trigger trg_notify_view after insert on profile_views
  for each row execute function notify_on_view();

-- Profile completed → welcome notification
create or replace function notify_on_complete()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_complete = true and (old.is_complete is distinct from true) then
    insert into notifications (user_id, type, actor_id, body, data)
    values (new.id, 'system', null, 'Willkommen bei E‑Liebe! Dein Profil ist startklar. 💜', jsonb_build_object());
  end if;
  return new;
end; $$;
drop trigger if exists trg_notify_complete on profiles;
create trigger trg_notify_complete after update on profiles
  for each row execute function notify_on_complete();

-- ============================================================================
--  END — after running this, notifications appear automatically in the app.
-- ============================================================================
