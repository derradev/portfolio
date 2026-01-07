-- Fix Admin Metadata Script for William Malone
-- This script safely updates William's user account to have proper admin role

-- First, let's check if the user_metadata column exists
DO $$
BEGIN
    -- Check if user_metadata column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'user_metadata'
    ) THEN
        -- Update existing user metadata safely
        UPDATE auth.users 
        SET user_metadata = '{"role": "admin", "name": "William Malone"}'
        WHERE email = 'william.malone80@gmail.com';
        
        RAISE NOTICE 'User metadata updated successfully!';
    ELSE
        -- Add user_metadata column if it doesn't exist
        ALTER TABLE auth.users 
        ADD COLUMN IF NOT EXISTS user_metadata JSONB DEFAULT '{}';
        
        -- Update the user metadata
        UPDATE auth.users 
        SET user_metadata = '{"role": "admin", "name": "William Malone"}'
        WHERE email = 'william.malone80@gmail.com';
        
        RAISE NOTICE 'user_metadata column added and metadata updated!';
    END IF;
END $$;

-- Verify the result
SELECT 
    email,
    raw_user_meta,
    user_metadata,
    created_at
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- Show completion message
SELECT 'Admin metadata setup completed!' as status;
