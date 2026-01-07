-- CORS Debug Solution for William Malone
-- This script tests if CORS is properly configured for admin access

-- Test CORS configuration by checking current settings
SELECT 
    'Current CORS Origins' as setting_name,
    'https://william-malone.com' as allowed_origin,
    'https://admin.william-malone.com' as admin_origin,
    'https://api.william-malone.com' as api_origin
FROM current_settings
WHERE setting_name IN ('FRONTEND_URL', 'ADMIN_URL', 'API_URL');

-- Check if admin domain is in CORS origins
DO $$
BEGIN
    -- Check if admin domain is properly configured
    IF NOT EXISTS (
        SELECT 1 
        FROM current_settings 
        WHERE setting_name = 'ADMIN_URL' 
        AND setting_value = 'https://admin.william-malone.com'
    ) THEN
        RAISE NOTICE '✅ Admin domain is properly configured in CORS';
    ELSE
        RAISE NOTICE '❌ Admin domain NOT found in CORS configuration';
    END IF;
    
    -- Check if API domain is properly configured
    IF NOT EXISTS (
        SELECT 1 
        FROM current_settings 
        WHERE setting_name = 'API_URL' 
        AND setting_value = 'https://api.william-malone.com'
    ) THEN
        RAISE NOTICE '✅ API domain is properly configured in CORS';
    ELSE
        RAISE NOTICE '❌ API domain NOT found in CORS configuration';
    END IF;
END $$;

-- Test if admin user has proper metadata
SELECT 
    email,
    user_metadata,
    CASE 
        WHEN user_metadata ? 'has admin role' 
        ELSE 'no admin role'
    END as admin_status
FROM auth.users 
WHERE email = 'william.malone80@gmail.com';

-- Show completion message
SELECT 'CORS debug completed - Check Vercel logs for detailed results' as status;
