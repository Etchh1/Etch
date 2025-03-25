-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create services table
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  price decimal not null,
  category text not null,
  images text[],
  location text,
  rating decimal default 0,
  review_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  booking_date timestamp with time zone not null,
  total_price decimal not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Services policies
create policy "Services are viewable by everyone"
  on services for select
  using ( true );

create policy "Providers can create services"
  on services for insert
  with check ( auth.uid() = provider_id );

create policy "Providers can update own services"
  on services for update
  using ( auth.uid() = provider_id );

-- Bookings policies
create policy "Users can view their own bookings"
  on bookings for select
  using ( auth.uid() = customer_id or auth.uid() = provider_id );

create policy "Customers can create bookings"
  on bookings for insert
  with check ( auth.uid() = customer_id );

create policy "Providers can update bookings"
  on bookings for update
  using ( auth.uid() = provider_id );

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on reviews for select
  using ( true );

create policy "Customers can create reviews"
  on reviews for insert
  with check ( auth.uid() = customer_id );

-- Messages policies
create policy "Users can view their own messages"
  on messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can send messages"
  on messages for insert
  with check ( auth.uid() = sender_id );

-- Create functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_services_updated_at
  before update on public.services
  for each row
  execute function public.handle_updated_at();

create trigger handle_bookings_updated_at
  before update on public.bookings
  for each row
  execute function public.handle_updated_at();

create trigger handle_reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at(); 