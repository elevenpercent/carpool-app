-- Run this in your Supabase SQL editor

create table if not exists families (
  id uuid default gen_random_uuid() primary key,
  parent_name text not null,
  email text not null unique,
  phone text not null,
  address text not null,
  lat float,
  lng float,
  seats int not null default 3,
  created_at timestamptz default now()
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

-- Allow public read/write (community app — no auth needed)
alter table families enable row level security;
alter table kids enable row level security;
alter table availability enable row level security;

create policy "public_all_families" on families for all using (true) with check (true);
create policy "public_all_kids" on kids for all using (true) with check (true);
create policy "public_all_availability" on availability for all using (true) with check (true);
