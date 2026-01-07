-- Simple Admin Setup Script for William Malone
-- This script works with standard PostgreSQL syntax

-- Start transaction
BEGIN;

-- Check if user exists and create temp table if needed
CREATE TEMP TABLE IF NOT EXISTS user_check AS (
    SELECT id, email, user_metadata, created_at 
    FROM auth.users 
    WHERE email = 'william.malone80@gmail.com'
);

-- Check if user_metadata column exists
DO $$
BEGIN
    -- Check if user_metadata column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'user_metadata'
    ) THEN
        -- User exists and column exists, just update metadata
        UPDATE auth.users 
        SET user_metadata = '{"role": "admin", "name": "William Malone"}'
        WHERE email = 'william.malone80@gmail.com';
        
        RAISE NOTICE 'User metadata updated successfully!';
    ELSE
        -- Check if user exists but column doesn't exist
        IF EXISTS (SELECT 1 FROM user_check) THEN
            -- User exists but no column, add it first
            ALTER TABLE auth.users 
            ADD COLUMN user_metadata JSONB DEFAULT '{}';
            
            RAISE NOTICE 'user_metadata column added successfully!';
            
            -- Now update the metadata
            UPDATE auth.users 
            SET user_metadata = '{"role": "admin", "name": "William Malone"}'
            WHERE email = 'william.malone80@gmail.com';
            
            RAISE NOTICE 'User metadata updated successfully!';
        ELSE
            -- User doesn't exist, create user with metadata
            INSERT INTO auth.users (
                id,
                email,
                created_at,
                user_metadata
            )
            SELECT 
                uuid_generate_v4(),
                'william.malone80@gmail.com',
                NOW(),
                '{"role": "admin", "name": "William Malone"}'
            ON CONFLICT (email) DO UPDATE SET
                user_metadata = '{"role": "admin", "name": "William Malone"}'
            WHERE auth.users.email = EXCLUDED.email;
            
            RAISE NOTICE 'User created and metadata set successfully!';
        END IF;
    END IF;
END $$;

-- Clean up temp table
DROP TABLE IF EXISTS user_check;

-- Verify the result
SELECT 
    email,
    user_metadata,
    created_at
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- Show completion message
SELECT 'Simple admin setup completed successfully!' as status;
