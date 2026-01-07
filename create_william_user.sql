-- Create William Malone User Account
-- This script creates William's user account with the exact credentials from backend

-- Insert William's user account with admin role
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

-- Show success message
SELECT 'William Malone user account created successfully!' as status;

-- Verify the user was created
SELECT 
    id,
    email,
    user_metadata,
    created_at
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';
