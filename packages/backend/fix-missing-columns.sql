-- Fix Missing Columns in Supabase Database
-- Run this in Supabase SQL Editor to add missing columns

-- Add missing columns to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Demi Taylor Nimmo',
ADD COLUMN IF NOT EXISTS read_time INTEGER DEFAULT 5;

-- Add missing columns to analytics table  
ALTER TABLE analytics
ADD COLUMN IF NOT EXISTS page_title VARCHAR(500),
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS visit_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS event_type VARCHAR(100) NOT NULL DEFAULT 'page_view';

-- Add missing columns to education table
ALTER TABLE education
ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Add missing columns to certifications table
ALTER TABLE certifications
ADD COLUMN IF NOT EXISTS expiry_date DATE;

-- Update existing blog posts to have author and read_time
UPDATE blog_posts 
SET author = 'Demi Taylor Nimmo', read_time = 5 
WHERE author IS NULL OR read_time IS NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name IN ('blog_posts', 'analytics', 'education', 'certifications')
ORDER BY table_name, ordinal_position;
