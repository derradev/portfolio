-- William Malone Portfolio Database Setup Script
-- Supabase PostgreSQL Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS TABLE (for Supabase Auth integration)
-- ============================================

-- Note: Supabase handles users automatically in auth.users
-- This profile table extends the auth users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- PROJECTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed')),
  company VARCHAR(255),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio
CREATE POLICY "Projects are publicly viewable" ON projects
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- BLOG POSTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author VARCHAR(255) DEFAULT 'William Malone',
  publish_date DATE DEFAULT CURRENT_DATE,
  read_time INTEGER DEFAULT 5,
  category VARCHAR(100) DEFAULT 'Cybersecurity',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Published posts are publicly viewable" ON blog_posts
  FOR SELECT USING (published = true);

-- Admin only write access
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- WORK HISTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS work_history (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  company_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Work history is publicly viewable" ON work_history
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage work history" ON work_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- EDUCATION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  grade VARCHAR(50),
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Education is publicly viewable" ON education
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage education" ON education
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- CERTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Certifications are publicly viewable" ON certifications
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage certifications" ON certifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- LEARNING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS learning (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  category VARCHAR(100) DEFAULT 'Cybersecurity',
  start_date DATE DEFAULT CURRENT_DATE,
  estimated_completion DATE,
  resources TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE learning ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Learning is publicly viewable" ON learning
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage learning" ON learning
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- SKILLS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Skills are publicly viewable" ON skills
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage skills" ON skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- FEATURE FLAGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id SERIAL PRIMARY KEY,
  flag_key VARCHAR(100) UNIQUE NOT NULL,
  flag_value BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Feature flags are publicly viewable" ON feature_flags
  FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admins can manage feature flags" ON feature_flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = 'william.malone80@gmail.com'
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date DESC);

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Learning indexes
CREATE INDEX IF NOT EXISTS idx_learning_status ON learning(status);
CREATE INDEX IF NOT EXISTS idx_learning_category ON learning(category);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_level ON skills(level);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_history_updated_at BEFORE UPDATE ON work_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_updated_at BEFORE UPDATE ON learning
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert William's profile
INSERT INTO profiles (id, email, full_name, location, bio) 
VALUES (
  uuid_generate_v4(),
  'william.malone80@gmail.com',
  'William Malone',
  'Middlesbrough, England',
  'IT Support Engineer transitioning into cybersecurity. Passionate about security, Python automation, and building practical security tools.'
) ON CONFLICT (email) DO NOTHING;

-- Sample learning items for William
INSERT INTO learning (title, description, progress, category, start_date, estimated_completion, resources, status) VALUES
(
  'CompTIA Security+ Certification',
  'Studying for CompTIA Security+ certification to build foundational cybersecurity knowledge',
  65,
  'Cybersecurity',
  '2024-01-01',
  '2024-06-30',
  ARRAY['Professor Messer'', 'CompTIA CertMaster'', 'Practice Exams'],
  'in_progress'
),
(
  'Python for Security Automation',
  'Learning Python scripting for security tasks and automation',
  40,
  'Python',
  '2024-02-01',
  '2024-08-31',
  ARRAY['Automate the Boring Stuff'', 'Black Hat Python'', 'TryHackMe Python'],
  'in_progress'
),
(
  'Home Lab Setup',
  'Building a home lab for penetration testing and security research',
  25,
  'Infrastructure',
  '2024-03-01',
  '2024-12-31',
  ARRAY['VirtualBox', 'Kali Linux', 'Metasploit', 'Wireshark'],
  'in_progress'
) ON CONFLICT DO NOTHING;

-- Sample skills
INSERT INTO skills (name, description, category, level, completed_date) VALUES
(
  'Active Directory Management',
  'Advanced Active Directory user, group, and policy management',
  'IT Infrastructure',
  'advanced',
  '2023-12-01'
),
(
  'Windows Server Administration',
  'Windows Server setup, maintenance, and troubleshooting',
  'IT Infrastructure',
  'intermediate',
  '2023-10-15'
),
(
  'Hardware Troubleshooting',
  'PC hardware diagnosis, repair, and maintenance',
  'IT Support',
  'advanced',
  '2023-08-20'
),
(
  'Python Programming',
  'Python scripting for automation and basic security tasks',
  'Programming',
  'beginner',
  NULL
),
(
  'Network Security Fundamentals',
  'Basic network security concepts and best practices',
  'Cybersecurity',
  'beginner',
  NULL
) ON CONFLICT DO NOTHING;

-- Sample feature flags
INSERT INTO feature_flags (flag_key, flag_value, description) VALUES
('maintenance_mode', false, 'Enable maintenance mode for the website'),
('blog_enabled', true, 'Enable blog functionality'),
('projects_enabled', true, 'Enable projects display'),
('contact_form_enabled', false, 'Enable contact form on website') ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for featured projects
CREATE OR REPLACE VIEW featured_projects AS
SELECT * FROM projects 
WHERE featured = true 
ORDER BY date DESC;

-- View for published blog posts
CREATE OR REPLACE VIEW published_blog_posts AS
SELECT * FROM blog_posts 
WHERE published = true 
ORDER BY publish_date DESC;

-- View for active learning items
CREATE OR REPLACE VIEW active_learning AS
SELECT * FROM learning 
WHERE status = 'in_progress'
ORDER BY progress DESC, start_date DESC;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Create a simple log table to track setup
CREATE TABLE IF NOT EXISTS setup_log (
  id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO setup_log (message) VALUES 
('Database setup completed successfully for William Malone Portfolio');

-- Final selection to confirm setup
SELECT 'Database setup completed successfully!' as status,
       NOW() as completed_at;
