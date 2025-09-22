-- Fix missing columns in portfolio database
-- Run this in pgAdmin Query Tool

-- Add missing columns to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Admin User';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_time INTEGER DEFAULT 5;

-- Add missing column to projects table  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name IN ('author', 'read_time');

SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'date';
