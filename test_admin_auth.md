# Admin Authentication Test

## 🚨 Issue Analysis

The admin panel is failing to login because it's trying to authenticate with Supabase, but William's user account might not exist in Supabase yet.

## 🔍 Debugging Steps

### 1. Check if User Exists in Supabase
Go to your Supabase dashboard → Authentication → Users and check if `william.malone80@gmail.com` exists.

### 2. If User Doesn't Exist
Create the user in Supabase Authentication:
- Email: `william.malone80@gmail.com`
- Password: Set a temporary password
- User Metadata: Add `role: 'admin'`

### 3. Update Admin Login
If user exists, the issue might be:
- Wrong password
- User metadata not set correctly
- CORS issues

## 🛠️ Quick Fix

### Option 1: Create User in Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project: William Malone Portfolio
3. Go to Authentication → Users
4. Click "Add user"
5. Email: `william.malone80@gmail.com`
6. Password: `tempPassword123`
7. User metadata: `{"role": "admin"}`
8. Save user

### Option 2: Test with Temporary Credentials
Try logging into admin panel with:
- Email: `william.malone80@gmail.com`
- Password: `tempPassword123`

## 🔧 Backend Verification

The backend `/api/auth/login` endpoint expects:
```json
{
  "email": "string",
  "password": "string"
}
```

And returns:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@email.com", 
      "name": "User Name",
      "role": "admin"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

## 🎯 Expected Result

Once the user is properly created in Supabase, the admin login should work correctly with William's credentials.
