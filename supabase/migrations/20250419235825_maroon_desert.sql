/*
  # Initial Database Schema for 1ShotBuilders

  1. New Tables
    - `users` - Stores user information and authentication details
    - `franchises` - Stores franchise information
    - `clients` - Stores client information linked to franchises
    - `projects` - Stores project details
    - `uploads` - Stores file upload metadata
    - `audit_logs` - Tracks user actions
    - `franchise_applications` - Stores franchise application information
    - `tags` - Stores project tags
    - `project_tags` - Junction table for projects and tags

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Set up appropriate foreign key constraints
*/

-- Enum types
CREATE TYPE user_role AS ENUM ('admin', 'internal', 'franchise', 'client', 'user');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed');
CREATE TYPE file_type AS ENUM ('image', 'video', 'document');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  franchise_id UUID,
  reset_token TEXT,
  reset_token_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Franchises table
CREATE TABLE IF NOT EXISTS franchises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  owner_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add franchise_id foreign key to users after franchises table is created
ALTER TABLE users ADD CONSTRAINT fk_users_franchise
  FOREIGN KEY (franchise_id) REFERENCES franchises(id);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  franchise_id UUID REFERENCES franchises(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  status project_status DEFAULT 'planning',
  franchise_id UUID REFERENCES franchises(id),
  client_id UUID REFERENCES clients(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  file_url TEXT NOT NULL,
  file_type file_type NOT NULL,
  approved_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  timestamp TIMESTAMPTZ DEFAULT now(),
  meta JSONB
);

-- Franchise applications table
CREATE TABLE IF NOT EXISTS franchise_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT,
  status application_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project tags junction table
CREATE TABLE IF NOT EXISTS project_tags (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins and internal staff can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'internal'));

CREATE POLICY "Admins can modify users"
  ON users
  USING (auth.jwt() ->> 'role' = 'admin');

-- Franchises policies
CREATE POLICY "Public can read franchises"
  ON franchises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify franchises"
  ON franchises
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Franchise owners can update their franchise"
  ON franchises
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id);

-- Clients policies
CREATE POLICY "Clients can read their own data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Franchise owners can read their clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'franchise' AND 
    franchise_id IN (
      SELECT id FROM franchises WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and internal staff can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'internal'));

CREATE POLICY "Admins can modify clients"
  ON clients
  USING (auth.jwt() ->> 'role' = 'admin');

-- Projects policies
CREATE POLICY "Public projects are visible to all"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clients can read their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'client' AND 
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Franchise owners can read and modify their projects"
  ON projects
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'franchise' AND 
    franchise_id IN (
      SELECT id FROM franchises WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and internal staff can read and modify all projects"
  ON projects
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'internal'));

-- Uploads policies
CREATE POLICY "Public uploads are visible to all"
  ON uploads
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can read project uploads they have access to"
  ON uploads
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE
        (auth.jwt() ->> 'role' = 'client' AND client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())) OR
        (auth.jwt() ->> 'role' = 'franchise' AND franchise_id IN (SELECT id FROM franchises WHERE owner_user_id = auth.uid())) OR
        (auth.jwt() ->> 'role' IN ('admin', 'internal'))
    )
  );

CREATE POLICY "Users can upload to projects they have access to"
  ON uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    project_id IN (
      SELECT id FROM projects WHERE
        (auth.jwt() ->> 'role' = 'client' AND client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())) OR
        (auth.jwt() ->> 'role' = 'franchise' AND franchise_id IN (SELECT id FROM franchises WHERE owner_user_id = auth.uid())) OR
        (auth.jwt() ->> 'role' IN ('admin', 'internal'))
    )
  );

CREATE POLICY "Admins and internal staff can approve uploads"
  ON uploads
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'internal')
  );

-- Audit logs policies
CREATE POLICY "Admins can read all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can insert audit logs for their actions"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Franchise applications policies
CREATE POLICY "Public can create franchise applications"
  ON franchise_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Applicants can view their own applications"
  ON franchise_applications
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can read and modify all applications"
  ON franchise_applications
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Tags policies
CREATE POLICY "Tags are readable by all authenticated users"
  ON tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify tags"
  ON tags
  USING (auth.jwt() ->> 'role' = 'admin');

-- Project tags policies
CREATE POLICY "Project tags are readable by all authenticated users"
  ON project_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and project owners can modify project tags"
  ON project_tags
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (project_id IN (
      SELECT id FROM projects WHERE
        (auth.jwt() ->> 'role' = 'franchise' AND franchise_id IN (SELECT id FROM franchises WHERE owner_user_id = auth.uid())) OR
        (auth.jwt() ->> 'role' = 'internal')
    ))
  );

-- Insert initial admin user
INSERT INTO users (id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@1shotbuilders.com',
  'Admin User',
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- Create some initial tags
INSERT INTO tags (name) VALUES
  ('Kitchen'),
  ('Bathroom'),
  ('Extension'),
  ('Commercial'),
  ('Residential'),
  ('Renovation'),
  ('New Build')
ON CONFLICT (name) DO NOTHING;