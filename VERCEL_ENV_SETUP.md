# Vercel Environment Variables Setup

## 🚨 **Required Environment Variables**

You need to set these environment variables in your Vercel project dashboard:

### **🔐 Supabase Configuration**

Go to your Vercel project → Settings → Environment Variables and add:

#### **Backend API Project** (`packages/backend`)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_CONNECTION_STRING=your_database_connection_string
```

#### **Frontend Project** (`packages/frontend`)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://api.william-malone.com
NEXT_PUBLIC_DOMAIN=https://william-malone.com
NEXT_PUBLIC_API_DOMAIN=https://api.william-malone.com
NEXT_PUBLIC_ADMIN_DOMAIN=https://admin.william-malone.com
```

#### **Admin Project** (`packages/admin`)
```
VITE_API_URL=https://api.william-malone.com
VITE_API_URL_PROD=https://api.william-malone.com
```

## 📋 **Where to Find Your Supabase Credentials**

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: William Malone Portfolio
3. **Go to Settings → API**
4. **Copy the following values**:
   - **Project URL**: `https://bughmfyuoikmfvxeeemq.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 **Deployment Steps**

### **1. Set Environment Variables in Vercel**
1. Go to your Vercel dashboard
2. Select the backend project
3. Go to Settings → Environment Variables
4. Add ALL the variables listed above
5. Make sure to check "Include Vercel Bot in Deploy Hooks"

### **2. Redeploy Backend**
```bash
cd packages/backend
vercel --prod
```

### **3. Redeploy Frontend**
```bash
cd packages/frontend  
vercel --prod
```

### **4. Redeploy Admin**
```bash
cd packages/admin
vercel --prod
```

## 🔍 **Verification**

After deployment, verify the variables are set:

1. **Check Vercel Function Logs**: Dashboard → Functions → Logs
2. **Test API Endpoints**: 
   ```bash
   curl https://api.william-malone.com/api/health
   ```

## ⚠️ **Important Notes**

- **Environment Variables**: Must be set for EACH project (backend, frontend, admin)
- **Vercel Bot**: Required for automatic deployments
- **Secret Values**: Never expose these in client-side code
- **Production URLs**: Use the actual domains, not localhost

## 🎯 **Expected Result**

Once environment variables are properly set, your backend should start successfully without the "supabase_url does not exist" error!
