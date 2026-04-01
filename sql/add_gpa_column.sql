-- Add GPA column to education table
-- Migration script for William Malone Portfolio

-- Add GPA column to education table
ALTER TABLE education 
ADD COLUMN gpa DECIMAL(3,2);

-- Add comment to describe the column
COMMENT ON COLUMN education.gpa IS 'Grade Point Average for educational achievements';

-- Update existing records to have default GPA if null
UPDATE education 
SET gpa = 3.5 
WHERE gpa IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'education' 
  AND column_name = 'gpa';

-- Show success message
SELECT 'GPA column added successfully to education table' as status;
