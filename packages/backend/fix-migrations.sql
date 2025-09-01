-- Fix corrupted migrations table and create analytics table

-- First, let's see what's currently in migrations table
SELECT 'Current migrations table:' as info;
SELECT * FROM migrations ORDER BY id;

-- Check if analytics table exists
SELECT 'Analytics table check:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'analytics';

-- Fix the migrations table - remove incorrect records
DELETE FROM migrations WHERE id = 2 AND name = 'seed_initial_data';
DELETE FROM migrations WHERE id = 3 AND name = 'seed_initial_data';

-- Re-add correct migration records
INSERT INTO migrations (id, name) VALUES (2, 'add_analytics_table');
INSERT INTO migrations (id, name) VALUES (3, 'seed_initial_data');

-- Create analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path_created_at ON analytics(page_path, created_at);

-- Verify final state
SELECT 'Fixed migrations table:' as info;
SELECT * FROM migrations ORDER BY id;

SELECT 'Analytics table verification:' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'analytics' ORDER BY ordinal_position;
