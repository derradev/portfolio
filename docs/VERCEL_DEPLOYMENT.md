# Vercel + Supabase Deployment Guide

## 🚀 Quick Setup

Your portfolio is now configured for Vercel and Supabase deployment with your custom domain `api.william-malone.com`.

## 1. Supabase Database Setup

### Run the database scripts
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Open the **SQL Editor**
3. Run `sql/database_setup.sql` from this repo (full schema), then optionally `sql/seed_data.sql` for sample content

### Verify Setup
After running the script, you should have:
- ✅ All database tables created
- ✅ Sample data inserted (projects, work history, skills, etc.)
- ✅ Row Level Security policies configured

### Create Admin User
**Important**: You must create an admin user in Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Set your email and secure password
4. Add **User Metadata**: `{"name": "Your Name", "role": "admin"}`

## 2. Vercel Deployment

### Environment Variables
Add these to your Vercel project settings (Dashboard → Settings → Environment Variables):

```bash
# Database (Session mode URI from Supabase → Settings → Database)
DATABASE_CONNECTION_STRING=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Supabase (Settings → API — URL must match the `ref` inside your keys)
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=[anon-public-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Authentication (generate a long random string; never commit the real value)
JWT_SECRET=[generate-with-openssl-rand-hex-32]

# Configuration
NODE_ENV=production
VAULT_ENABLED=false
VERCEL=1

# URLs (update these after deployment)
FRONTEND_URL=https://william-malone.com
ADMIN_URL=https://admin.william-malone.com
API_URL=https://api.william-malone.com
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
3. Add all environment variables above
4. Deploy!

## 3. Domain Architecture

Your portfolio uses a multi-domain setup:

### 🌐 **Domain Structure:**
- **Frontend**: `https://william-malone.com` (main portfolio site)
- **Admin Panel**: `https://admin.william-malone.com` (admin interface)
- **Backend API**: `https://api.william-malone.com` (API endpoints)

### **Frontend & Admin → API Communication:**
- Frontend calls: `https://api.william-malone.com/api/projects`
- Admin calls: `https://api.william-malone.com/api/auth/login`
- All client apps point to the same backend API domain

### **Vercel Deployment Options:**

#### Option 1: Single Vercel Project (Recommended)
Deploy everything as one project with domain routing:
1. **Main domain**: `william-malone.com` → Frontend
2. **API subdomain**: `api.william-malone.com` → Backend API
3. **Admin subdomain**: `admin.william-malone.com` → Admin (separate deployment)

#### Option 2: Separate Vercel Projects
- **Project 1**: Frontend (`william-malone.com`)
- **Project 2**: Backend API (`api.william-malone.com`) 
- **Project 3**: Admin Panel (`admin.william-malone.com`)

## 4. Local Development

### Environment Files Created:
- ✅ `packages/backend/.env` - Backend configuration
- ✅ `packages/frontend/.env.local` - Frontend Supabase config
- ✅ `packages/admin/.env.local` - Admin Supabase config

### Test Local Connection:
```bash
npm run dev
```

Your local setup now connects to:
- **Database**: Your Supabase instance
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Admin**: http://localhost:3002

## 5. Features Configured

### ✅ Database Integration
- PostgreSQL via Supabase
- Connection pooling
- SSL required for security

### ✅ Authentication
- JWT-based auth system
- Admin login functionality
- Supabase Auth integration ready

### ✅ API Configuration
- Custom domain support
- CORS configured for all domains
- Rate limiting
- Error handling

### ✅ Deployment Ready
- Vercel serverless functions
- Environment-specific configurations
- Production optimizations

## 6. Next Steps

1. **Deploy to Vercel** using the environment variables above
2. **Configure custom domains** in Vercel dashboard
3. **Test API endpoints** at your custom domain
4. **Update frontend/admin** to use production API URLs
5. **Set up monitoring** and analytics

## 7. API Endpoints

Once deployed, your API will be available at:
- `https://api.william-malone.com/api/health` - Health check
- `https://api.william-malone.com/api/projects` - Projects
- `https://api.william-malone.com/api/blog` - Blog posts
- `https://api.william-malone.com/api/auth` - Authentication
- And all other endpoints...

## 🎉 You're Ready to Deploy!

Your portfolio is now fully configured for Vercel and Supabase with your custom domain setup.
