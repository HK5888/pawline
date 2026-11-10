create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'customer',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles are readable" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update profiles" on public.profiles for update using (true);

create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  breed text,
  size text check (size in ('small','medium','large')),
  notes text,
  created_at timestamptz default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  duration_minutes int not null default 60,
  active boolean default true
);

create table public.opening_hours (
  weekday int primary key check (weekday between 0 and 6),
  open time not null,
  close time not null
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id),
  dog_id uuid references public.dogs(id),
  service_id uuid references public.services(id),
  groomer_id uuid references public.profiles(id),
  starts_at timestamptz not null,
  status text not null default 'booked',
  created_at timestamptz default now()
);
