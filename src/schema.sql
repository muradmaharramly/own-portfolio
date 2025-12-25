-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Yalnız 1 sətr
  full_name TEXT NOT NULL,
  headline TEXT,
  about TEXT,
  profile_image TEXT,
  cv_file TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT NOT NULL,
  description TEXT,
  project_image TEXT,
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Technologies (One-to-Many)
CREATE TABLE IF NOT EXISTS project_technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  technology_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_name TEXT NOT NULL,
  institution_logo TEXT,
  degree TEXT,
  field_of_study TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Skills (One-to-Many)
CREATE TABLE IF NOT EXISTS education_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  education_id UUID REFERENCES education(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  company_logo TEXT,
  position TEXT NOT NULL,
  employment_type TEXT, -- 'full-time', 'part-time', etc.
  experience_type TEXT, -- 'work', 'internship', etc.
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Skills (One-to-Many)
CREATE TABLE IF NOT EXISTS experience_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID REFERENCES experience(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_name TEXT NOT NULL,
  proficiency_percentage INTEGER CHECK (proficiency_percentage >= 0 AND proficiency_percentage <= 100),
  proficiency_level TEXT, -- 'Native', 'Advanced', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Table
CREATE TABLE IF NOT EXISTS social_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Info Table (Singleton)
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  address TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage Buckets (Policies need to be set manually in Supabase Dashboard)
-- project-images
-- profile-images
-- cv-files
-- institution-logos
-- company-logos
