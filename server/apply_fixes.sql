-- ============================================================================
--  E-LIEBE — One-shot fixes. Run ONCE in the Supabase SQL editor.
--  (Dashboard → SQL editor → paste → Run)
--
--  Fixes verified by scripts/e2e.js:
--   1) Mutual likes never created a match  → trigger must be SECURITY DEFINER
--   2) "Likes you" was always empty        → swipes needs a swipee read policy
--   3) Photo upload failed (0-photo users) → Storage needs upload policies
--   4) Notifications never created          → match/message/like/view triggers
-- ============================================================================

-- 1) AUTO-MATCH ---------------------------------------------------------------
-- The reciprocal-like lookup must bypass RLS, otherwise the other person's
-- swipe is invisible and no match is ever created.
create or replace function handle_mutual_like()
returns trigger language plpgsql security definer set search_path = public as $$
declare reciprocal boolean;
begin
  if new.action in ('like','superlike') then
    select exists(
      select 1 from swipes s
      where s.swiper_id = new.swipee_id
        and s.swipee_id = new.swiper_id
        and s.action in ('like','superlike')
    ) into reciprocal;

    if reciprocal then
      insert into matches (user_a, user_b)
      values (pair_low(new.swiper_id, new.swipee_id),
              pair_high(new.swiper_id, new.swipee_id))
      on conflict (user_a, user_b) do nothing;
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists trg_swipe_match on swipes;
create trigger trg_swipe_match after insert on swipes
  for each row execute function handle_mutual_like();

-- 2) "LIKES YOU" --------------------------------------------------------------
-- Let a user see incoming likes/super-likes (not passes) targeting them.
drop policy if exists "swipes incoming" on swipes;
create policy "swipes incoming" on swipes for select
  using (auth.uid() = swipee_id and action in ('like','superlike'));

-- 3) STORAGE (photo uploads) --------------------------------------------------
-- Ensure the bucket is public for reads, and allow each user to manage files
-- inside their own  <uid>/...  folder.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "photos public read"  on storage.objects;
drop policy if exists "photos upload own"    on storage.objects;
drop policy if exists "photos update own"    on storage.objects;
drop policy if exists "photos delete own"    on storage.objects;

create policy "photos public read" on storage.objects for select
  using (bucket_id = 'photos');
create policy "photos upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos update own" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 4) NOTIFICATIONS ------------------------------------------------------------
-- match → both users; message → recipient; like → liked user; view → viewed.
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
--  DONE. Re-run:  node scripts/e2e.js   → everything should pass.
-- ============================================================================
