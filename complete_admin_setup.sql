-- Complete Admin Setup Script for William Malone
-- This script handles everything: adds column if needed, then updates metadata

-- Start transaction
DO $$
BEGIN
    -- First, let's check if the user exists
    SELECT id, email, user_metadata, created_at 
    INTO temp_user_data
    FROM auth.users 
    WHERE email = 'william.malone80@gmail.com';
    
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
        IF EXISTS (SELECT 1 FROM temp_user_data) THEN
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
DROP TABLE IF EXISTS temp_user_data;

-- Verify the result
SELECT 
    email,
    user_metadata,
    created_at
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- Show completion message
SELECT 'Complete admin setup finished successfully!' as status;
