-- Update Admin Metadata via Supabase Admin API
-- This script uses the Supabase JavaScript client to update user metadata
-- Run this in Supabase Dashboard → SQL Editor with JavaScript option

-- First, check if user exists
SELECT id, email, user_metadata, created_at 
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- If user exists, update their metadata
-- Note: This assumes you're running this in the Supabase SQL Editor with JavaScript enabled

-- Update user metadata for existing user
UPDATE auth.users 
SET user_metadata = '{"role": "admin", "name": "William Malone"}'
WHERE email = 'william.malone80@gmail.com';

-- Alternative: Create user if they don't exist (for reference)
/*
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
  user_metadata = EXCLUDED.user_metadata || '{"role": "admin", "name": "William Malone"}'
WHERE auth.users.email = EXCLUDED.email;
*/

-- Show success message
SELECT 'Admin metadata updated via API successfully!' as status;
