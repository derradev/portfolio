-- Complete GPA Migration Script for William Malone Portfolio
-- This script safely adds the GPA column and updates existing data

-- Start transaction
BEGIN;

-- Check if GPA column already exists
DO $$
BEGIN
    -- Add GPA column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'education' 
        AND column_name = 'gpa'
    ) THEN
        ALTER TABLE education 
        ADD COLUMN gpa DECIMAL(3,2);
        
        -- Add comment
        COMMENT ON COLUMN education.gpa IS 'Grade Point Average for educational achievements';
        
        -- Update existing records with appropriate GPAs based on grades
        UPDATE education 
        SET gpa = CASE 
            WHEN grade LIKE '%Distinction%' THEN 3.67
            WHEN grade LIKE '%DDM%' THEN 3.67
            WHEN grade LIKE '%Merit%' THEN 3.33
            WHEN grade LIKE '%Pass%' THEN 2.67
            WHEN grade LIKE '%First%' THEN 3.8
            WHEN grade LIKE '%2:1%' THEN 3.67
            WHEN grade LIKE '%2:2%' THEN 3.33
            ELSE 3.0
        END
        WHERE gpa IS NULL;
        
        RAISE NOTICE 'GPA column added successfully';
    ELSE
        RAISE NOTICE 'GPA column already exists';
    END IF;
END $$;

-- Commit transaction
COMMIT;

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'education' 
  AND column_name = 'gpa';

-- Show updated education records
SELECT 
    id,
    institution,
    degree,
    grade,
    gpa,
    'GPA ' || CASE 
        WHEN gpa >= 3.67 THEN '(High Distinction)'
        WHEN gpa >= 3.33 THEN '(Distinction)'
        WHEN gpa >= 3.0 THEN '(Merit)'
        WHEN gpa >= 2.67 THEN '(Pass)'
        ELSE '(Standard)'
    END as gpa_classification
FROM education 
ORDER BY start_date DESC;

-- Migration complete message
SELECT 'GPA migration completed successfully!' as migration_status;
