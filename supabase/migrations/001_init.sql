create extension if not exists pgcrypto;

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  status text check (status in ('available_now','next_container','seasonal_limited')),
  quality_note text,
  unit_label text,
  featured boolean default false,
  image_url text,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  reference_id text unique not null,
  request_type text not null check (request_type in ('reserve','restock')),
  business_name text not null,
  contact_name text not null,
  phone_whatsapp text not null,
  email text,
  parish text,
  business_type text,
  urgency text check (urgency in ('asap','1_2_days','3_7_days','not_urgent')),
  substitutions_allowed boolean default true,
  notes text,
  status text check (status in ('new','contacted','quoted','confirmed','fulfilled','archived')) default 'new',
  assigned_to uuid null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id) on delete cascade,
  inventory_item_id uuid references inventory_items(id),
  custom_item_name text,
  quantity numeric,
  unit_label text,
  item_status_at_request text,
  created_at timestamp default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('image','video')),
  url text not null,
  tag text check (tag in ('delivery','shelf_stock','fresh_closeup','container_day')),
  featured boolean default false,
  created_at timestamp default now()
);

alter table inventory_items enable row level security;
alter table requests enable row level security;
alter table request_items enable row level security;
alter table media_assets enable row level security;

create policy "public read active inventory" on inventory_items for select using (is_active = true);
create policy "public read media" on media_assets for select using (true);
create policy "public insert requests" on requests for insert with check (true);
create policy "public insert request items" on request_items for insert with check (true);

create policy "admin full inventory" on inventory_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin update requests" on requests for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin select requests" on requests for select using (auth.role() = 'authenticated');
create policy "admin read request items" on request_items for select using (auth.role() = 'authenticated');
create policy "admin full media" on media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
