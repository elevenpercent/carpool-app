-- Run this entire script in your Supabase SQL Editor

-- Communities
create table if not exists communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  school_name text not null,
  neighborhood text not null,
  code text not null unique,
  created_at timestamptz default now()
);

-- Families (community-scoped)
create table if not exists families (
  id uuid default gen_random_uuid() primary key,
  community_id uuid references communities(id) on delete cascade,
  parent_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  lat float,
  lng float,
  seats int not null default 3,
  created_at timestamptz default now(),
  unique (community_id, email)
);

create table if not exists kids (
  id uuid default gen_random_uuid() primary key,
  family_id uuid references families(id) on delete cascade,
  name text not null,
  grade text not null
);

create table if not exists availability (
  id uuid default gen_random_uuid() primary key,
  family_id uuid references families(id) on delete cascade,
  day text not null,
  can_drop boolean default false,
  can_pickup boolean default false,
  drop_time time,
  pickup_time time
);

-- RLS — public read/write (no auth needed for community app)
alter table communities enable row level security;
alter table families enable row level security;
alter table kids enable row level security;
alter table availability enable row level security;

create policy "public_communities" on communities for all using (true) with check (true);
create policy "public_families" on families for all using (true) with check (true);
create policy "public_kids" on kids for all using (true) with check (true);
create policy "public_availability" on availability for all using (true) with check (true);
