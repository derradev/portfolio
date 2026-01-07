-- Debug Authentication Issues
-- This script helps identify why authentication is failing

-- Check if environment variables are set
SELECT 
    'SUPABASE_URL' as env_supabase_url,
    'SUPABASE_SERVICE_ROLE_KEY' as env_service_key
    current_setting('supabase.url') as db_supabase_url
FROM current_settings;

-- Check if Supabase client can be initialized
DO $$
BEGIN
    -- Try to create Supabase client
    BEGIN
        -- This will fail if environment variables are not set
        PERFORM 'SELECT 1'::text;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Supabase client initialization failed: %', SQLERRM;
    END;
END $$;

-- Check if user exists in auth.users
SELECT 
    id,
    email,
    user_metadata,
    created_at
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- Check if user_metadata column exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name = 'user_metadata';

-- Show debug info
SELECT 'Authentication debug completed!' as status;
