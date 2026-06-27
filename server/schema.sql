-- ============================================================================
--  E-LIEBE — Dating App · Supabase / PostgreSQL schema
--  Complete, normalized & indexed schema covering every screen & feature.
--  Run this in the Supabase SQL editor (or `supabase db push`).
--
--  Screen → table map
--    Splash / Language / Welcome ............. profiles.language, user_settings
--    Email Signup / Login / Reset Password ... auth.users (Supabase Auth) + profiles
--    Profile Setup wizard (7 steps) .......... profiles, profile_photos,
--                                              profile_interests, lifestyle cols
--    Discover (swipe deck) ................... profiles, swipes, matches,
--                                              user_preferences, blocks
--    Filters / Preferences .................. user_preferences
--    Profile Detail ......................... profiles + photos + interests
--    Matches / Match Success ................ matches, swipes (likes received)
--    Chat List / Chat ....................... matches, messages, message_reads
--    Block / Report ......................... blocks, reports
--    Notifications Center ................... notifications
--    My Profile (stats) ..................... v_profile_stats (view)
--    Edit Profile ........................... profiles, profile_photos, interests
--    Privacy Settings ....................... user_settings
--    Notification Settings .................. user_settings
--    Change Password / Account / Logout ..... auth.users (Supabase Auth)
--    Premium ................................ subscriptions
--    Private Relationship Mode .............. profiles (private cols), couple_links
--    Profile views .......................... profile_views
--    Push notifications ..................... devices
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "postgis";     -- geo distance filtering
create extension if not exists "pg_trgm";     -- fuzzy text search (city/name)

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
create type gender_type        as enum ('female', 'male', 'nonbinary');
create type show_me_type        as enum ('women', 'men', 'everyone');
create type relationship_goal   as enum ('serious', 'marriage', 'longterm', 'friendship', 'open');
create type civil_status_type   as enum ('single', 'divorced', 'widowed', 'separated');
create type religion_type       as enum ('christian','muslim','jewish','hindu','buddhist','spiritual','none','other');
create type smoking_type        as enum ('no', 'sometimes', 'yes');
create type drinking_type       as enum ('no', 'social', 'regular');
create type exercise_type       as enum ('never', 'sometimes', 'often');
create type children_type       as enum ('have', 'want', 'no', 'open');
create type diet_type           as enum ('omnivore', 'vegetarian', 'vegan');
create type pets_type           as enum ('dog', 'cat', 'none', 'other');
create type language_type       as enum ('de', 'en');

create type swipe_action        as enum ('like', 'pass', 'superlike');
create type message_type        as enum ('text', 'image');
create type notification_type   as enum ('match', 'message', 'like', 'view', 'system');
create type report_reason       as enum ('spam','inappropriate','harassment','fake','underage','other');
create type report_status       as enum ('pending', 'reviewing', 'resolved', 'dismissed');
create type rel_status_type      as enum ('single', 'dating', 'relationship', 'engaged');
create type couple_link_status   as enum ('pending', 'accepted', 'declined', 'ended');
create type sub_plan_type        as enum ('free', 'premium', 'premium_plus');
create type sub_status_type      as enum ('active', 'trialing', 'canceled', 'expired');
create type device_platform      as enum ('ios', 'android', 'web');

-- ----------------------------------------------------------------------------
-- 2. SHARED HELPERS
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Canonical ordering for a pair of user ids (used by matches/blocks uniqueness)
create or replace function pair_low(a uuid, b uuid) returns uuid
  language sql immutable as $$ select least(a::text, b::text)::uuid $$;
create or replace function pair_high(a uuid, b uuid) returns uuid
  language sql immutable as $$ select greatest(a::text, b::text)::uuid $$;

-- ============================================================================
-- 3. PROFILES  (1:1 with auth.users)
-- ============================================================================
create table profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,

  -- Basic information (Profile Setup → Basics, Edit Profile)
  name               text not null,
  date_of_birth      date,                              -- age computed from this
  gender             gender_type,
  show_me            show_me_type default 'everyone',   -- interested in
  bio                text check (char_length(bio) <= 600),
  job                text,
  education          text,
  height_cm          smallint check (height_cm between 120 and 230),

  -- Location (Basics) — geography for distance filtering
  country            char(2),                           -- 'de','ch','at'
  city               text,
  location           geography(Point, 4326),            -- lng/lat
  show_distance      boolean default true,

  -- Goals & lifestyle (Profile Setup → Goals / Lifestyle)
  relationship_goal  relationship_goal,
  civil_status       civil_status_type,
  religion           religion_type,
  smoking            smoking_type,
  drinking           drinking_type,
  exercise           exercise_type,
  children           children_type,
  diet               diet_type,
  pets               pets_type,

  -- Status & meta
  language           language_type default 'de',
  is_verified        boolean default false,
  is_complete        boolean default false,             -- setup wizard finished
  is_premium         boolean default false,             -- denormalized from subscriptions
  last_active_at     timestamptz default now(),

  -- Private Relationship Mode
  private_mode       boolean default false,
  hide_discovery     boolean default false,             -- not shown in deck
  pause_matching     boolean default false,
  rel_status         rel_status_type,

  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

create index idx_profiles_gender        on profiles(gender);
create index idx_profiles_show_me       on profiles(show_me);
create index idx_profiles_dob           on profiles(date_of_birth);
create index idx_profiles_goal          on profiles(relationship_goal);
create index idx_profiles_religion      on profiles(religion);
create index idx_profiles_location      on profiles using gist(location);
create index idx_profiles_last_active   on profiles(last_active_at desc);
create index idx_profiles_discoverable  on profiles(is_complete) where hide_discovery = false and pause_matching = false;

-- ============================================================================
-- 4. PHOTOS  (Profile Setup → Photos, Edit Profile)
-- ============================================================================
create table profile_photos (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  url         text not null,                            -- Supabase Storage path
  position    smallint not null default 0,              -- order in grid (0 = main)
  is_primary  boolean not null default false,
  created_at  timestamptz default now(),
  unique (profile_id, position)
);
create index idx_photos_profile on profile_photos(profile_id);
-- exactly one primary photo per profile
create unique index uq_photos_primary on profile_photos(profile_id) where is_primary;

-- ============================================================================
-- 5. INTERESTS  (lookup + join)  (Profile Setup → Interests, Filters)
-- ============================================================================
create table interests (
  id        smallserial primary key,
  slug      text unique not null,                       -- 'travel','yoga',...
  label_de  text not null,
  label_en  text not null,
  sort      smallint default 0
);

create table profile_interests (
  profile_id  uuid not null references profiles(id) on delete cascade,
  interest_id smallint not null references interests(id) on delete cascade,
  primary key (profile_id, interest_id)
);
create index idx_profile_interests_interest on profile_interests(interest_id);

-- ============================================================================
-- 6. PREFERENCES  (Filters screen + Relationship Preferences)
-- ============================================================================
create table user_preferences (
  user_id        uuid primary key references profiles(id) on delete cascade,
  show_me        show_me_type default 'everyone',
  age_min        smallint default 18 check (age_min >= 18),
  age_max        smallint default 60 check (age_max <= 100),
  max_distance_km smallint default 50 check (max_distance_km between 1 and 500),
  goal           relationship_goal,                     -- preferred goal (nullable = any)
  religions      religion_type[] default '{}',          -- empty = any
  interest_ids   smallint[] default '{}',               -- empty = any
  updated_at     timestamptz default now(),
  check (age_max >= age_min)
);
create trigger trg_preferences_updated before update on user_preferences
  for each row execute function set_updated_at();

-- ============================================================================
-- 7. SWIPES  (Discover: like / pass / superlike)
-- ============================================================================
create table swipes (
  id         uuid primary key default gen_random_uuid(),
  swiper_id  uuid not null references profiles(id) on delete cascade,
  swipee_id  uuid not null references profiles(id) on delete cascade,
  action     swipe_action not null,
  created_at timestamptz default now(),
  unique (swiper_id, swipee_id),
  check (swiper_id <> swipee_id)
);
create index idx_swipes_swiper on swipes(swiper_id, created_at desc);
-- "who liked me" (Matches → likes received / premium)
create index idx_swipes_likes_received on swipes(swipee_id) where action in ('like','superlike');

-- ============================================================================
-- 8. MATCHES  (a match == a conversation; exactly two users)
-- ============================================================================
create table matches (
  id            uuid primary key default gen_random_uuid(),
  user_a        uuid not null references profiles(id) on delete cascade,  -- always the lower id
  user_b        uuid not null references profiles(id) on delete cascade,  -- always the higher id
  created_at    timestamptz default now(),
  last_message_at timestamptz,
  is_active     boolean default true,                   -- false after unmatch
  unique (user_a, user_b),
  check (user_a < user_b)
);
create index idx_matches_user_a on matches(user_a, last_message_at desc);
create index idx_matches_user_b on matches(user_b, last_message_at desc);

-- Auto-create a match when two users like each other.
-- SECURITY DEFINER so the reciprocal-like lookup bypasses RLS (otherwise the
-- other person's swipe is invisible and no match is ever created).
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
create trigger trg_swipe_match after insert on swipes
  for each row execute function handle_mutual_like();

-- ============================================================================
-- 9. MESSAGES + READ STATE  (Chat: text, images, read receipts)
-- ============================================================================
create table messages (
  id           uuid primary key default gen_random_uuid(),
  match_id     uuid not null references matches(id) on delete cascade,
  sender_id    uuid not null references profiles(id) on delete cascade,
  type         message_type not null default 'text',
  body         text,                                    -- text content
  image_url    text,                                    -- Storage path for image msgs
  created_at   timestamptz default now(),
  delivered_at timestamptz,
  read_at      timestamptz,                             -- read receipt
  check (
    (type = 'text'  and body is not null) or
    (type = 'image' and image_url is not null)
  )
);
create index idx_messages_match on messages(match_id, created_at);
create index idx_messages_unread on messages(match_id, sender_id) where read_at is null;

-- keep matches.last_message_at fresh for chat-list ordering
create or replace function bump_match_last_message()
returns trigger language plpgsql as $$
begin
  update matches set last_message_at = new.created_at where id = new.match_id;
  return new;
end; $$;
create trigger trg_message_bump after insert on messages
  for each row execute function bump_match_last_message();

-- ============================================================================
-- 10. BLOCK / REPORT  (Chat options sheet)
-- ============================================================================
create table blocks (
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index idx_blocks_blocked on blocks(blocked_id);

create table reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references profiles(id) on delete cascade,
  reported_id  uuid not null references profiles(id) on delete cascade,
  reason       report_reason not null,
  details      text,
  status       report_status not null default 'pending',
  created_at   timestamptz default now(),
  check (reporter_id <> reported_id)
);
create index idx_reports_reported on reports(reported_id);
create index idx_reports_status on reports(status);

-- ============================================================================
-- 11. PROFILE VIEWS  (Notifications: "viewed your profile" / stats)
-- ============================================================================
create table profile_views (
  viewer_id  uuid not null references profiles(id) on delete cascade,
  viewed_id  uuid not null references profiles(id) on delete cascade,
  viewed_at  timestamptz default now(),
  primary key (viewer_id, viewed_id),
  check (viewer_id <> viewed_id)
);
create index idx_views_viewed on profile_views(viewed_id, viewed_at desc);

-- ============================================================================
-- 12. NOTIFICATIONS CENTER
-- ============================================================================
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,   -- recipient
  type       notification_type not null,
  actor_id   uuid references profiles(id) on delete cascade,            -- other person (null for system)
  body       text,
  data       jsonb default '{}',                                        -- {matchId, messageId, ...}
  is_read    boolean default false,
  created_at timestamptz default now()
);
create index idx_notifications_user on notifications(user_id, created_at desc);
create index idx_notifications_unread on notifications(user_id) where is_read = false;

-- ============================================================================
-- 13. SETTINGS  (Notification + Privacy + account toggles, 1:1)
-- ============================================================================
create table user_settings (
  user_id              uuid primary key references profiles(id) on delete cascade,

  -- Notification settings
  notify_matches       boolean default true,
  notify_messages      boolean default true,
  notify_likes         boolean default true,
  notify_views         boolean default false,
  notify_promos        boolean default false,
  email_notifications  boolean default true,

  -- Privacy settings
  show_online_status   boolean default true,
  show_distance        boolean default true,
  read_receipts        boolean default true,
  incognito_mode       boolean default false,
  show_activity_status boolean default true,

  -- Security / account
  two_factor_enabled   boolean default false,

  updated_at           timestamptz default now()
);
create trigger trg_settings_updated before update on user_settings
  for each row execute function set_updated_at();

-- ============================================================================
-- 14. PREMIUM SUBSCRIPTIONS
-- ============================================================================
create table subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  plan         sub_plan_type not null default 'premium',
  status       sub_status_type not null default 'active',
  provider     text,                                    -- 'apple','google','stripe'
  provider_ref text,                                    -- store transaction / sub id
  started_at   timestamptz default now(),
  expires_at   timestamptz,
  created_at   timestamptz default now()
);
create index idx_subscriptions_user on subscriptions(user_id, status);

-- ============================================================================
-- 15. PRIVATE RELATIONSHIP MODE — shared couple space
-- ============================================================================
create table couple_links (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,   -- inviter
  partner_id  uuid references profiles(id) on delete cascade,            -- invited (nullable until accepted)
  invite_email text,                                                     -- invite by email before signup
  status      couple_link_status not null default 'pending',
  created_at  timestamptz default now(),
  accepted_at timestamptz,
  check (user_id <> partner_id)
);
create index idx_couple_links_user on couple_links(user_id);
create index idx_couple_links_partner on couple_links(partner_id);

-- ============================================================================
-- 16. DEVICES  (push notification tokens)
-- ============================================================================
create table devices (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  push_token   text not null,                           -- Expo push token / FCM / APNs
  platform     device_platform not null,
  last_seen_at timestamptz default now(),
  created_at   timestamptz default now(),
  unique (push_token)
);
create index idx_devices_user on devices(user_id);

-- ============================================================================
-- 17. VIEWS  (My Profile stats: likes / matches / views)
-- ============================================================================
create or replace view v_profile_stats as
select
  p.id as profile_id,
  (select count(*) from swipes s
     where s.swipee_id = p.id and s.action in ('like','superlike')) as likes_received,
  (select count(*) from matches m
     where (m.user_a = p.id or m.user_b = p.id) and m.is_active) as matches_count,
  (select count(*) from profile_views v where v.viewed_id = p.id) as profile_views
from profiles p;

-- ============================================================================
-- 18. AUTO-PROVISIONING  (create profile rows on Supabase Auth signup)
-- ============================================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  insert into public.user_settings (user_id)    values (new.id);
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- 19. ROW LEVEL SECURITY  (Supabase — enable + baseline policies)
--     Tighten/expand per your backend rules later.
-- ============================================================================
alter table profiles            enable row level security;
alter table profile_photos      enable row level security;
alter table profile_interests   enable row level security;
alter table user_preferences    enable row level security;
alter table user_settings       enable row level security;
alter table swipes              enable row level security;
alter table matches             enable row level security;
alter table messages            enable row level security;
alter table blocks              enable row level security;
alter table reports             enable row level security;
alter table profile_views       enable row level security;
alter table notifications       enable row level security;
alter table subscriptions       enable row level security;
alter table couple_links        enable row level security;
alter table devices             enable row level security;
-- interests is a public lookup (read-only for everyone)
alter table interests           enable row level security;
create policy "interests readable" on interests for select using (true);

-- Profiles: everyone (authenticated) can read discoverable profiles; you edit your own.
create policy "profiles read"   on profiles for select using (true);
create policy "profiles update" on profiles for update using (auth.uid() = id);
create policy "profiles insert" on profiles for insert with check (auth.uid() = id);

-- Photos: public read, owner writes.
create policy "photos read"  on profile_photos for select using (true);
create policy "photos write" on profile_photos for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Interests join: public read, owner writes.
create policy "pinterests read"  on profile_interests for select using (true);
create policy "pinterests write" on profile_interests for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Own-row tables
create policy "prefs own"     on user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings own"  on user_settings    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subs own"      on subscriptions    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "devices own"   on devices          for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notifs own"    on notifications    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Swipes: you create & read your own.
create policy "swipes own" on swipes for all using (auth.uid() = swiper_id) with check (auth.uid() = swiper_id);
-- ...and you can see incoming likes/super-likes ("Likes you").
create policy "swipes incoming" on swipes for select
  using (auth.uid() = swipee_id and action in ('like','superlike'));

-- Matches: visible to the two participants.
create policy "matches read" on matches for select using (auth.uid() = user_a or auth.uid() = user_b);

-- Messages: only the two match participants can read/send.
create policy "messages access" on messages for select using (
  exists (select 1 from matches m where m.id = messages.match_id and (auth.uid() = m.user_a or auth.uid() = m.user_b))
);
create policy "messages send" on messages for insert with check (
  auth.uid() = sender_id and
  exists (select 1 from matches m where m.id = messages.match_id and (auth.uid() = m.user_a or auth.uid() = m.user_b))
);
create policy "messages mark read" on messages for update using (
  exists (select 1 from matches m where m.id = messages.match_id and (auth.uid() = m.user_a or auth.uid() = m.user_b))
);

-- Blocks / Reports / Views: actor-owned.
create policy "blocks own"  on blocks        for all    using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);
create policy "reports own"  on reports       for insert with check (auth.uid() = reporter_id);
create policy "views insert" on profile_views for insert with check (auth.uid() = viewer_id);
create policy "views read"   on profile_views for select using (auth.uid() = viewed_id or auth.uid() = viewer_id);

-- Couple links: visible/editable by the two members.
create policy "couple own" on couple_links for all
  using (auth.uid() = user_id or auth.uid() = partner_id)
  with check (auth.uid() = user_id);

-- Storage: public 'photos' bucket; each user manages files in their own folder.
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
  on conflict (id) do update set public = true;
create policy "photos public read" on storage.objects for select
  using (bucket_id = 'photos');
create policy "photos upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos update own" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================================
-- 20. SEED — lookup data (mirrors the app's constants)
-- ============================================================================
insert into interests (slug, label_de, label_en, sort) values
  ('travel','Reisen','Travel',1),
  ('cooking','Kochen','Cooking',2),
  ('fitness','Fitness','Fitness',3),
  ('music','Musik','Music',4),
  ('movies','Filme','Movies',5),
  ('reading','Lesen','Reading',6),
  ('photography','Fotografie','Photography',7),
  ('art','Kunst','Art',8),
  ('hiking','Wandern','Hiking',9),
  ('yoga','Yoga','Yoga',10),
  ('coffee','Kaffee','Coffee',11),
  ('wine','Wein','Wine',12),
  ('dancing','Tanzen','Dancing',13),
  ('foodie','Foodie','Foodie',14),
  ('pets','Haustiere','Pets',15),
  ('nature','Natur','Nature',16),
  ('gaming','Gaming','Gaming',17),
  ('fashion','Mode','Fashion',18),
  ('tech','Technik','Technology',19),
  ('sports','Sport','Sports',20),
  ('meditation','Meditation','Meditation',21),
  ('volunteering','Ehrenamt','Volunteering',22)
on conflict (slug) do nothing;

-- ============================================================================
--  END OF SCHEMA
-- ============================================================================
