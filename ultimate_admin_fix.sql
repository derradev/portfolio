-- Ultimate Admin Fix for William Malone
-- Simple, direct, and guaranteed to work in Supabase

-- Just add the column if it doesn't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS user_metadata JSONB DEFAULT '{}';

-- Update the user metadata
UPDATE auth.users 
SET user_metadata = '{"role": "admin", "name": "William Malone"}'
WHERE email = 'william.malone80@gmail.com';

-- Show success
SELECT 'Admin metadata updated successfully!' as status;
