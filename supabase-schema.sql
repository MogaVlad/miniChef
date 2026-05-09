-- ============================================================
-- miniChef — Supabase schema
-- Run this in the Supabase SQL Editor (supabase.com → project → SQL Editor)
-- ============================================================

-- 1. Profiles (extends auth.users with first/last name)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  last_name text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Anyone can read profiles"  on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Saved recipes (per user)
create table public.saved_recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  prep_time text not null,
  ingredients text[] not null,
  prep_details text not null,
  category text not null,
  saved_at timestamptz default now(),
  unique (user_id, name, category)
);

alter table public.saved_recipes enable row level security;
create policy "Users can read own saved recipes"  on public.saved_recipes for select using (auth.uid() = user_id);
create policy "Users can insert own saved recipes" on public.saved_recipes for insert with check (auth.uid() = user_id);
create policy "Users can delete own saved recipes" on public.saved_recipes for delete using (auth.uid() = user_id);

-- 3. Community recipes (shared by all users)
create table public.community_recipes (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  name text not null,
  prep_time text not null,
  ingredients text[] not null,
  prep_details text not null,
  category text not null,
  posted_at timestamptz default now()
);

alter table public.community_recipes enable row level security;
create policy "Anyone can read community recipes" on public.community_recipes for select using (true);
create policy "Auth users can post"              on public.community_recipes for insert with check (auth.uid() = author_id);
create policy "Authors can delete own"           on public.community_recipes for delete using (auth.uid() = author_id);

-- 4. Likes on community recipes
create table public.community_likes (
  recipe_id uuid references public.community_recipes on delete cascade,
  user_id uuid references auth.users on delete cascade,
  primary key (recipe_id, user_id)
);

alter table public.community_likes enable row level security;
create policy "Anyone can read likes"      on public.community_likes for select using (true);
create policy "Auth users can like"        on public.community_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike own likes" on public.community_likes for delete using (auth.uid() = user_id);
