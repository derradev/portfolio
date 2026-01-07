-- Update User Metadata Script for William Malone
-- This script updates William's user account to have proper admin role

-- Update user metadata to set admin role
UPDATE auth.users 
SET user_metadata = jsonb_set(
  user_metadata || '{}'::jsonb,
  '{"role": "admin", "name": "William Malone"}'
)
WHERE email = 'william.malone80@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  raw_user_meta,
  user_metadata
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- Show success message
SELECT 'User metadata updated successfully!' as status;

-- Alternative: Insert if user doesn't exist
-- INSERT INTO auth.users (
--   id,
--   email,
--   created_at,
--   user_metadata
-- )
-- SELECT 
--   uuid_generate_v4(),
--   'william.malone80@gmail.com',
--   NOW(),
--   '{"role": "admin", "name": "William Malone"}'
-- ) ON CONFLICT (email) DO NOTHING;
