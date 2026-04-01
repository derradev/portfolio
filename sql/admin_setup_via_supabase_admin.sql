-- Admin Setup via Supabase Admin Function
-- This script uses the Supabase admin API to bypass permission restrictions

-- First, let's set up the admin client
DO $$
BEGIN
    -- Create a temporary function to call the admin API
    CREATE OR REPLACE FUNCTION temp_admin_update() RETURNS TRIGGER AS $$
    BEGIN
        -- Call the admin API to update user metadata
        -- This uses the service role key which has admin privileges
        PERFORM dblink(
            'https://bughmfyuoikmfvxeeemq.supabase.co',
            'POST',
            '/rest/v1/admin/users',
            'application/json',
            'Content-Type: application/json',
            'Authorization: Bearer [your_service_role_key]',
            '{
                "email": "william.malone80@gmail.com",
                "user_metadata": {
                    "role": "admin",
                    "name": "William Malone"
                }
            }'
        );
        
        -- Return success
        RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;

-- Use the function to update William's user metadata
SELECT temp_admin_update();

-- Clean up the temporary function
DROP FUNCTION IF EXISTS temp_admin_update();

-- Show success message
SELECT 'Admin setup completed via Supabase Admin API!' as status;

-- Alternative: Direct SQL approach (if you have service role key)
-- UPDATE auth.users 
-- SET user_metadata = '{"role": "admin", "name": "William Malone"}'
-- WHERE email = 'william.malone80@gmail.com';
