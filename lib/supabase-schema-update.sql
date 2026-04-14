-- ================================================================
-- BMC Watch: Civic Project Rating Platform — Schema Update
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================

-- 1. USER PROFILES TABLE
-- Linked to Supabase Auth. Auto-created on first login via trigger.
create table public.user_profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  display_name text default 'Civic Observer',
  total_points integer default 0,
  total_ratings integer default 0,
  badge_rank text default 'Novice Observer',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now()),
  constraint user_profiles_pkey primary key (id)
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Users can read all profiles (for leaderboards)
create policy "Profiles are viewable by everyone"
  on user_profiles for select using (true);

-- Users can only update their own profile
create policy "Users can update their own profile"
  on user_profiles for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on user_profiles for insert with check (auth.uid() = id);


-- 2. PROJECT RATINGS TABLE
-- Replaces the old `reports` table concept
create table public.project_ratings (
  id uuid default gen_random_uuid() not null,
  project_id text not null references public.bmc_projects(id),
  user_id uuid not null references public.user_profiles(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  photo_url text not null,
  ai_analysis jsonb,
  is_genuine boolean default false,
  ai_reasoning text,
  points_awarded integer default 0,
  status text default 'Pending',
  blockchain_hash text,
  blockchain_tx_hash text,
  blockchain_verified boolean default false,
  created_at timestamp with time zone default timezone('utc', now()),
  constraint project_ratings_pkey primary key (id)
);

-- Enable RLS
alter table public.project_ratings enable row level security;

-- Everyone can read ratings (public transparency)
create policy "Ratings are viewable by everyone"
  on project_ratings for select using (true);

-- Only authenticated users can submit ratings
create policy "Authenticated users can insert ratings"
  on project_ratings for insert with check (auth.uid() = user_id);


-- 3. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- When a new user signs up via Email OTP, this automatically
-- creates their user_profiles row.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 4. SAFE POINT AWARD FUNCTION (RPC)
-- Prevents race conditions when awarding points
create or replace function public.award_points(
  p_user_id uuid,
  p_points integer
)
returns void as $$
begin
  update public.user_profiles
  set
    total_points = total_points + p_points,
    total_ratings = total_ratings + 1,
    updated_at = now(),
    badge_rank = case
      when total_points + p_points >= 500 then 'Elite Auditor'
      when total_points + p_points >= 200 then 'Senior Inspector'
      when total_points + p_points >= 50  then 'Active Citizen'
      else 'Novice Observer'
    end
  where id = p_user_id;
end;
$$ language plpgsql security definer;
