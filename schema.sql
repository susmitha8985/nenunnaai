create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key,
  name text not null,
  email text unique not null,
  phone text,
  role text not null default 'patient' check (role in ('patient','doctor','admin','lab_staff')),
  created_at timestamptz not null default now()
);

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date_of_birth date,
  gender text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  qualification text,
  experience integer default 0,
  clinic text,
  phone text,
  email text,
  consultation_fee numeric(10,2) default 0,
  rating numeric(2,1) default 0,
  profile_image text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists doctor_availability (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references doctors(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  available boolean not null default true
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  booking_id text unique not null,
  patient_id uuid not null references patients(id),
  doctor_id uuid not null references doctors(id),
  appointment_date date not null,
  appointment_time time not null,
  consultation_type text not null check (consultation_type in ('clinic','video')),
  status text not null default 'pending',
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists lab_tests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  price numeric(10,2) not null,
  discount numeric(10,2) default 0,
  sample_type text,
  report_delivery_time text,
  status text not null default 'active'
);

create table if not exists lab_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text unique not null,
  patient_id uuid not null references patients(id),
  test_id uuid not null references lab_tests(id),
  booking_date date not null,
  booking_time time not null,
  collection_type text not null check (collection_type in ('home','lab')),
  address text,
  status text not null default 'booked',
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  lab_booking_id uuid references lab_bookings(id),
  report_name text not null,
  storage_path text,
  status text not null default 'pending',
  uploaded_at timestamptz not null default now()
);

create table if not exists whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  phone_number text unique not null,
  status text not null default 'active',
  last_message text,
  created_at timestamptz not null default now()
);

create table if not exists whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references whatsapp_conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  message text,
  message_type text,
  external_message_id text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  type text not null,
  title text not null,
  message text not null,
  status text not null default 'unread',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text not null,
  resource text not null,
  resource_id text,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('medical-reports', 'medical-reports', false)
on conflict (id) do nothing;