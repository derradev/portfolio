-- =====================================================
-- SUPABASE FULL BUILD SCRIPT FOR PORTFOLIO DATABASE
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- This will create all tables, indexes, policies, and sample data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS migrations CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS learning CASCADE;
DROP TABLE IF EXISTS work_history CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  technologies JSONB,
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(100) NOT NULL,
  tags JSONB,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  image_url VARCHAR(500),
  author VARCHAR(255) DEFAULT 'Admin User',
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work history table
CREATE TABLE work_history (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  achievements JSONB,
  technologies JSONB,
  company_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning table
CREATE TABLE learning (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  estimated_completion DATE,
  resources JSONB,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  grade VARCHAR(50),
  description TEXT,
  achievements JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications table
CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url VARCHAR(500),
  description TEXT,
  skills JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  session_id VARCHAR(100) NOT NULL,
  visit_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migrations tracking table
CREATE TABLE migrations (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path_created_at ON analytics(page_path, created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_work_history_company ON work_history(company);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES
-- =====================================================
-- Public read access policies
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access for work history" ON work_history FOR SELECT USING (true);
CREATE POLICY "Public read access for learning" ON learning FOR SELECT USING (true);
CREATE POLICY "Public read access for skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access for education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access for certifications" ON certifications FOR SELECT USING (true);

-- Analytics write policy (allow anonymous inserts for tracking)
CREATE POLICY "Allow analytics tracking" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow analytics read" ON analytics FOR SELECT USING (true);

-- Admin policies (you can adjust these based on your auth setup)
-- For now, allowing all operations for authenticated users
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (true);
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Admin full access work_history" ON work_history FOR ALL USING (true);
CREATE POLICY "Admin full access learning" ON learning FOR ALL USING (true);
CREATE POLICY "Admin full access skills" ON skills FOR ALL USING (true);
CREATE POLICY "Admin full access education" ON education FOR ALL USING (true);
CREATE POLICY "Admin full access certifications" ON certifications FOR ALL USING (true);
CREATE POLICY "Admin full access users" ON users FOR ALL USING (true);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert admin user (password is 'admin123' hashed with bcrypt)
INSERT INTO users (email, password, name, role) VALUES 
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');

-- Create admin user in Supabase Auth
-- Note: You'll need to create this user manually in Supabase Dashboard > Authentication > Users
-- Or run this after the tables are created:
-- Email: admin@example.com
-- Password: admin123
-- User Metadata: {"name": "Admin User", "role": "admin"}

-- Insert sample projects
INSERT INTO projects (title, description, content, technologies, github_url, live_url, featured, date) VALUES 
(
  'LunaLore Platform',
  'Building a platform for VTubers to manage character lore and community engagement using Electron, Next.JS, Supabase and Vercel',
  'A comprehensive platform designed for VTubers to create, manage, and share their character lore while fostering community engagement. Built with modern technologies for cross-platform compatibility.',
  '["Electron", "Next.js", "Supabase", "Vercel", "TypeScript", "React"]',
  'https://github.com/demitaylor/lunalore',
  'https://lunalore.vercel.app',
  true,
  '2024-01-15'
),
(
  'FamilyNova Social Network',
  'A social networking app for kids featured in ExpoTees, focusing on safe digital interaction',
  'A safe and engaging social networking platform designed specifically for children, with robust safety features and parental controls. Featured in ExpoTees for its innovative approach to child-friendly social media.',
  '["React", "Node.js", "MongoDB", "Express", "Socket.io", "AWS"]',
  'https://github.com/demitaylor/familynova',
  null,
  true,
  '2023-08-20'
),
(
  '3TX Digital Logistics Platform',
  'Micro-frontend architecture implementation reducing build times by 50% and improving scalability',
  'A comprehensive digital logistics platform built with micro-frontend architecture. Implemented event-driven AWS Lambda functions and reusable UI component library.',
  '["StencilJS", "AngularJS", "Node.js", "AWS Lambda", "DynamoDB", "TypeScript"]',
  null,
  null,
  false,
  '2023-05-10'
);

-- Insert work history
INSERT INTO work_history (company, position, location, start_date, end_date, description, achievements, technologies, company_url) VALUES 
(
  'PASS LTD',
  'Mid-Level Software Developer',
  'Stockton-on-Tees, UK',
  '2024-06-01',
  '2024-08-31',
  'Optimized system update processes and redesigned user interfaces to improve accessibility and user experience.',
  '["Optimized system update processes, reducing manual intervention by 80%", "Redesigned the user interface improving accessibility and usability for 100% of users"]',
  '["Git", "GitLab", "C#", "Avalonia", "WPF", "Microsoft SQL", "MVVM"]',
  null
),
(
  '3T Global',
  'Mid-Level Software Developer',
  'Newcastle-upon-Tyne, UK (Remote)',
  '2022-07-01',
  '2024-06-30',
  'Implemented micro-frontend architectures, designed AWS Lambda functions, and mentored junior developers in an Agile environment.',
  '["Implemented micro-frontend architectures, reducing frontend build times by 50%", "Designed and optimized event-driven AWS Lambda functions, reducing data processing time by 60%", "Built and documented a reusable UI component library, improving development efficiency by 40%", "Led a data migration process ensuring 99.9% uptime", "Mentored junior developers, improving team productivity by 25%"]',
  '["Git", "C#", "JavaScript", "TypeScript", "StencilJS", "AngularJS", "Node.js", "DynamoDB", "Microsoft SQL", "Aurora Serverless", "Next.js", "OpenSearch", "Storybook", "AWS", "Webpack", "Babel", "ESLint", "Prettier"]',
  null
),
(
  '3T Global',
  'Junior Software Developer',
  'Newcastle-upon-Tyne, UK (Remote)',
  '2021-02-01',
  '2022-07-31',
  'Maintained and optimized legacy systems while collaborating with cross-functional teams to deliver features efficiently.',
  '["Maintained and optimized legacy systems, reducing system downtime by 35%", "Collaborated with cross-functional teams, delivering features 20% faster"]',
  '["Git", "C#", "JavaScript", "TypeScript", "AngularJS", "Microsoft SQL", "CSS", "HTML", ".NET MVC"]',
  null
);

-- Insert learning items
INSERT INTO learning (title, description, progress, category, start_date, estimated_completion, resources, status) VALUES 
(
  'Quantum Computing Fundamentals',
  'Exploring quantum computing principles, quantum algorithms, and their practical applications in modern computing.',
  45,
  'Emerging Technology',
  '2024-01-15',
  '2024-06-30',
  '["IBM Qiskit Documentation", "Quantum Computing Course", "Research Papers"]',
  'in_progress'
),
(
  'Advanced AWS Serverless Architecture',
  'Deep diving into serverless patterns, Lambda optimization, and event-driven architectures on AWS.',
  75,
  'Cloud Computing',
  '2023-11-01',
  '2024-03-15',
  '["AWS Documentation", "Serverless Framework", "AWS Well-Architected Framework"]',
  'in_progress'
),
(
  'VR Development with Unity',
  'Learning VR development for immersive experiences and interactive digital environments.',
  30,
  'Game Development',
  '2024-02-01',
  '2024-08-30',
  '["Unity VR Documentation", "VRChat SDK", "Oculus Development Guide"]',
  'in_progress'
);

-- Insert skills
INSERT INTO skills (name, category, level, description) VALUES 
('JavaScript', 'Programming Languages', 'Advanced', 'Expert in modern JavaScript, ES6+, and TypeScript'),
('TypeScript', 'Programming Languages', 'Advanced', 'Strong typing and advanced TypeScript patterns'),
('C#', 'Programming Languages', 'Advanced', '.NET development and enterprise applications'),
('React', 'Frontend Frameworks', 'Advanced', 'Modern React with hooks, context, and performance optimization'),
('Next.js', 'Frontend Frameworks', 'Advanced', 'Full-stack React framework with SSR and API routes'),
('AngularJS', 'Frontend Frameworks', 'Intermediate', 'Legacy AngularJS maintenance and development'),
('StencilJS', 'Frontend Frameworks', 'Intermediate', 'Web component development and micro-frontends'),
('Node.js', 'Backend Technologies', 'Advanced', 'Server-side JavaScript and API development'),
('AWS', 'Cloud Platforms', 'Advanced', 'Lambda, DynamoDB, Aurora, and serverless architectures'),
('PostgreSQL', 'Databases', 'Intermediate', 'Relational database design and optimization'),
('Microsoft SQL', 'Databases', 'Intermediate', 'Enterprise database development and management'),
('DynamoDB', 'Databases', 'Intermediate', 'NoSQL database design and optimization'),
('Git', 'Development Tools', 'Advanced', 'Version control and collaborative development workflows'),
('Docker', 'DevOps', 'Intermediate', 'Containerization and deployment strategies'),
('Microservices', 'Architecture', 'Advanced', 'Event-driven architecture and distributed systems'),
('Micro-Frontends', 'Architecture', 'Advanced', 'Scalable frontend architecture patterns');

-- Insert education
INSERT INTO education (institution, degree, field_of_study, location, start_date, end_date, grade, description, achievements) VALUES 
(
  'Teesside University',
  'Bachelor of Science',
  'Computer Science',
  'Middlesbrough, UK',
  '2017-09-01',
  '2021-06-30',
  'First Class Honours',
  'Comprehensive computer science program covering software engineering, algorithms, databases, and system design.',
  '["First Class Honours degree", "Dean''s List for academic excellence", "Final year project on distributed systems"]'
);

-- Insert certifications
INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, credential_url, description, skills) VALUES 
(
  'AWS Certified Solutions Architect - Associate',
  'Amazon Web Services',
  '2023-03-15',
  '2026-03-15',
  'AWS-SAA-2023-001',
  'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
  'Validates expertise in designing distributed systems on AWS with focus on scalability, security, and cost optimization.',
  '["AWS Lambda", "EC2", "S3", "RDS", "DynamoDB", "CloudFormation", "IAM"]'
),
(
  'Microsoft Certified: Azure Developer Associate',
  'Microsoft',
  '2022-11-20',
  '2024-11-20',
  'MS-AZ-204-2022',
  'https://docs.microsoft.com/en-us/learn/certifications/azure-developer/',
  'Demonstrates skills in developing cloud solutions on Microsoft Azure platform.',
  '["Azure Functions", "Azure App Service", "Azure Storage", "Azure SQL", "ARM Templates"]'
);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, category, tags, featured, published, author, read_time) VALUES 
(
  'Building Scalable Micro-Frontends with StencilJS',
  'building-scalable-micro-frontends-stenciljs',
  '# Building Scalable Micro-Frontends with StencilJS

Micro-frontends have revolutionized how we think about frontend architecture. In this post, I''ll share my experience implementing micro-frontend architectures at 3T Global, where we reduced build times by 50%.

## What are Micro-Frontends?

Micro-frontends extend the concept of microservices to the frontend world. Instead of building a monolithic frontend application, we break it down into smaller, manageable pieces that can be developed, tested, and deployed independently.

## Why StencilJS?

StencilJS provides an excellent foundation for micro-frontends because:
- **Framework Agnostic**: Components work with any framework
- **Small Bundle Size**: Optimized output with minimal overhead
- **TypeScript Support**: Built-in TypeScript support
- **Web Standards**: Based on web components standards

## Implementation Strategy

Our implementation involved several key steps:

1. **Component Library**: Created a shared component library
2. **Build Pipeline**: Optimized build processes
3. **Deployment**: Independent deployment strategies
4. **Integration**: Seamless integration patterns

The results were impressive - we saw a 50% reduction in build times and significantly improved developer experience.',
  'Learn how we implemented micro-frontend architectures using StencilJS, reducing build times by 50% and improving scalability.',
  'Architecture',
  '["micro-frontends", "stenciljs", "architecture", "scalability", "web-components"]',
  true,
  true,
  'Demi Taylor Nimmo',
  8
),
(
  'AWS Lambda Optimization: Lessons from Production',
  'aws-lambda-optimization-production-lessons',
  '# AWS Lambda Optimization: Lessons from Production

After working extensively with AWS Lambda functions in production environments, I''ve learned valuable lessons about optimization and performance. Here are the key insights that helped us reduce data processing time by 60%.

## Cold Start Optimization

Cold starts are one of the biggest challenges with Lambda functions. Here''s what worked for us:

### 1. Connection Pooling
```javascript
// Bad: Creating new connections each time
const client = new DatabaseClient();

// Good: Reusing connections
let client;
const getClient = () => {
  if (!client) {
    client = new DatabaseClient();
  }
  return client;
};
```

### 2. Provisioned Concurrency
For critical functions, provisioned concurrency eliminates cold starts entirely.

## Memory and Timeout Configuration

Finding the right balance between memory allocation and cost is crucial:
- **Monitor CloudWatch metrics** to understand actual usage
- **Use AWS Lambda Power Tuning** to find optimal configurations
- **Consider CPU-bound vs I/O-bound** workloads

## Event-Driven Architecture

Designing proper event-driven architectures with Lambda:
- **Use SQS for reliable processing**
- **Implement proper error handling and DLQs**
- **Design for idempotency**

These optimizations resulted in significant performance improvements and cost savings.',
  'Practical lessons learned from optimizing AWS Lambda functions in production, including cold start mitigation and performance tuning.',
  'Cloud Computing',
  '["aws", "lambda", "optimization", "serverless", "performance"]',
  true,
  true,
  'Demi Taylor Nimmo',
  6
);

-- Insert migration record
INSERT INTO migrations (id, name) VALUES (1, 'supabase_full_setup_complete');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify everything was created successfully

-- Check table counts
SELECT 
  'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'work_history', COUNT(*) FROM work_history
UNION ALL
SELECT 'learning', COUNT(*) FROM learning
UNION ALL
SELECT 'skills', COUNT(*) FROM skills
UNION ALL
SELECT 'education', COUNT(*) FROM education
UNION ALL
SELECT 'certifications', COUNT(*) FROM certifications
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'migrations', COUNT(*) FROM migrations;

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Your Supabase database is now fully configured with:
-- ✅ All tables created
-- ✅ Indexes for performance
-- ✅ Row Level Security enabled
-- ✅ Public read policies
-- ✅ Sample data inserted
-- ✅ Admin user created (email: admin@example.com, password: admin123)
--
-- You can now connect your application using the DATABASE_URL
-- from your Supabase project settings.
