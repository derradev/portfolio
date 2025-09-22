# Vercel + Supabase Deployment Guide

## 🚀 Quick Setup

Your portfolio is now configured for Vercel and Supabase deployment with your custom domain `api.demitaylornimmo.com`.

## 1. Supabase Database Setup

### Run the Database Migration
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Open the **SQL Editor**
3. Copy and paste the entire `packages/backend/supabase-full-setup.sql` script
4. Click **"Run"** to create all tables and sample data

### Verify Setup
After running the script, you should have:
- ✅ All database tables created
- ✅ Sample data inserted (projects, work history, skills, etc.)
- ✅ Admin user created (email: `admin@example.com`, password: `admin123`)
- ✅ Row Level Security policies configured

## 2. Vercel Deployment

### Environment Variables
Add these to your Vercel project settings (Dashboard → Settings → Environment Variables):

```bash
# Database
DATABASE_CONNECTION_STRING=postgres://postgres.vtkekrttdxohsqqadzwu:PdiqfcDNQ1dHugRH@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require

# Supabase
SUPABASE_URL=https://vtkekrttdxohsqqadzwu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a2VrcnR0ZHhvaHNxcWFkend1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIzMDgsImV4cCI6MjA3NDEzODMwOH0.a4KS4UstRF-AO1I2IvpIpgsVkQivDevK5DyoDvaT0pE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a2VrcnR0ZHhvaHNxcWFkend1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjMwOCwiZXhwIjoyMDc0MTM4MzA4fQ.kceHemv1QyTM5xu1p-NzOfQn3fqUfNfgofIKUhODx5E

# Authentication
JWT_SECRET=8c653503e73f6cd2afc47a6c66ec768ecd56d59f792eea58cf22178dc35de431f49087f1d79fe13218ac9ed131925493944f38c5ab522400759ffdba0769cbee
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Configuration
NODE_ENV=production
VAULT_ENABLED=false
VERCEL=1

# URLs (update these after deployment)
FRONTEND_URL=https://demitaylornimmo.com
ADMIN_URL=https://admin.demitaylornimmo.com
API_URL=https://api.demitaylornimmo.com
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
- **Frontend**: `https://demitaylornimmo.com` (main portfolio site)
- **Admin Panel**: `https://admin.demitaylornimmo.com` (admin interface)
- **Backend API**: `https://api.demitaylornimmo.com` (API endpoints)

### **Frontend & Admin → API Communication:**
- Frontend calls: `https://api.demitaylornimmo.com/api/projects`
- Admin calls: `https://api.demitaylornimmo.com/api/auth/login`
- All client apps point to the same backend API domain

### **Vercel Deployment Options:**

#### Option 1: Single Vercel Project (Recommended)
Deploy everything as one project with domain routing:
1. **Main domain**: `demitaylornimmo.com` → Frontend
2. **API subdomain**: `api.demitaylornimmo.com` → Backend API
3. **Admin subdomain**: `admin.demitaylornimmo.com` → Admin (separate deployment)

#### Option 2: Separate Vercel Projects
- **Project 1**: Frontend (`demitaylornimmo.com`)
- **Project 2**: Backend API (`api.demitaylornimmo.com`) 
- **Project 3**: Admin Panel (`admin.demitaylornimmo.com`)

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
- `https://api.demitaylornimmo.com/api/health` - Health check
- `https://api.demitaylornimmo.com/api/projects` - Projects
- `https://api.demitaylornimmo.com/api/blog` - Blog posts
- `https://api.demitaylornimmo.com/api/auth` - Authentication
- And all other endpoints...

## 🎉 You're Ready to Deploy!

Your portfolio is now fully configured for Vercel and Supabase with your custom domain setup.
