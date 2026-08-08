-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  bio text,
  location text,
  reading_score integer default 0 not null,
  streak integer default 0 not null,
  monthly_goal integer default 4 not null,
  monthly_progress integer default 0 not null,
  genres text,
  goals text,
  verification_status boolean default false not null,
  badges text[] default '{}'::text[] not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Set up Row Level Security policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- Trigger function to automatically create a profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, bio, location, genres, goals)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'New Reader'),
    '',
    '',
    '',
    ''
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
