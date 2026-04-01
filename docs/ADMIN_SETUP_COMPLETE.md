# 🛡️ Admin Setup Complete Guide

## 🎯 **Objective**
Set up William Malone as admin user in Supabase to enable admin panel access.

## 📋 **Setup Steps**

### **Step 1: Create User Account in Supabase**
1. Go to https://app.supabase.com
2. Select your project: William Malone Portfolio
3. Navigate to **Authentication** → **Users**
4. Click **"Add user"**
5. Enter:
   - **Email**: `william.malone80@gmail.com`
   - **Password**: Choose a secure password
   - **User metadata** (JSON format):
     ```json
     {"role": "admin", "name": "William Malone"}
     ```
6. Click **"Save user"**

### **Step 2: Update User Metadata**

#### **Option 1: Use Supabase Dashboard (Recommended)**
1. Go to https://app.supabase.com
2. Select your project: William Malone Portfolio
3. Navigate to **SQL Editor**
4. Enable **JavaScript** in the settings (wrench icon → Settings)
5. Paste the entire content of `update_admin_via_api.sql`
6. Execute

#### **Option 2: Use Supabase Client**
If you have the service role key and want to update programmatically.

#### **⚠️ Important Note**
If you get a "permission denied" error when trying to UPDATE, use the `update_admin_via_api.sql` script instead. This script works within Supabase's security model.

### **Step 3: Alternative - Use Update Script**
If you prefer not to use the Supabase dashboard:

1. **Create service role key** in Supabase Settings → API
2. **Use the script** with your service role key:
   ```bash
   # Replace with your actual service role key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   psql "postgresql://[your-connection-string]" -f update_user_metadata.sql
   ```

### **Step 4: Verify Admin Access**
1. Go to admin panel: `https://admin.william-malone.com`
2. Login with:
   - **Email**: `william.malone80@gmail.com`
   - **Password**: The password you set in Step 1
3. Should successfully authenticate and show admin dashboard

## 🚨 **Troubleshooting**

### **Login Still Fails?**
- **Check user exists**: Verify email is exactly `william.malone80@gmail.com`
- **Check metadata**: Ensure user metadata contains `"role": "admin"`
- **Clear browser cache**: Try incognito/private browsing
- **Check console**: Look for authentication errors in browser dev tools

### **Common Issues**
- **Wrong email**: Typos in email address
- **Metadata not set**: User created without proper role
- **Password mismatch**: Incorrect password
- **CORS issues**: Backend not allowing admin domain

## ✅ **Expected Result**

After completing these steps:
- ✅ William can login to admin panel
- ✅ Has full admin privileges
- ✅ Can manage all portfolio content
- ✅ Authentication works with Supabase

## 🔐 **Security Notes**

- **Use strong password**: For the initial user creation
- **Enable 2FA**: Recommended for production
- **Secure service role key**: Never expose in frontend code
- **Regular backups**: Of Supabase settings and user data

## 📞 **Support Files Created**

- `update_user_metadata.sql`: Script to set admin role
- `test_admin_auth.md`: Authentication debugging guide
- `VERCEL_ENV_SETUP.md`: Environment variables setup guide

## 🚀 **Ready for Production**

Once these steps are completed, William's admin panel will be fully functional and ready for content management!
