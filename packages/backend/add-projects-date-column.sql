-- Add missing date column to projects table
ALTER TABLE projects ADD COLUMN date DATE;

-- Set default date for existing projects based on created_at
UPDATE projects SET date = created_at::DATE WHERE date IS NULL;
