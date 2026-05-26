# Supabase Database Schema

## Tables

### referrals
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  patient_first_name TEXT NOT NULL,
  patient_last_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'MA',
  zip TEXT,
  phone TEXT NOT NULL,
  insurance_type TEXT,
  referring_physician TEXT,
  referring_facility TEXT,
  diagnosis TEXT,
  services_requested TEXT[],
  preferred_contact TEXT,
  preferred_office TEXT,
  submitter_name TEXT NOT NULL,
  submitter_role TEXT,
  submitter_phone TEXT,
  submitter_email TEXT NOT NULL,
  document_url TEXT,
  hipaa_acknowledged BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new'
);
```

### jobs
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  type TEXT,
  location TEXT,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE
);
```

### applications
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'received'
);
```

### contacts
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  preferred_office TEXT
);
```

## Row-Level Security (RLS)

Enable RLS on all tables and set these policies:

### referrals
- **Public INSERT**: Anyone can insert referrals
- **Admin SELECT/UPDATE**: Only authenticated admin users can view and update

### jobs
- **Public SELECT**: Anyone can view active jobs
- **Admin INSERT/UPDATE/DELETE**: Only authenticated admin users

### applications
- **Public INSERT**: Anyone can submit applications
- **Admin SELECT**: Only authenticated admin users

### contacts
- **Public INSERT**: Anyone can submit contact forms
- **Admin SELECT**: Only authenticated admin users

## Auth Setup

1. Create admin user in Supabase Auth dashboard
2. Store admin role in `auth.users` metadata
3. Set JWT secret in backend `.env`
