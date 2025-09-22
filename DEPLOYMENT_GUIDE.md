# Deployment Guide - Separate Vercel Projects

This portfolio consists of 3 separate applications that should be deployed as individual Vercel projects:

## 1. Frontend (Main Website)
**Deploy from**: `/packages/frontend`
**Domain**: `demitaylornimmo.com`
**Vercel Config**: `/packages/frontend/vercel.json`

### Steps:
1. Create new Vercel project
2. Connect to GitHub repo
3. Set root directory to `packages/frontend`
4. Deploy

### Environment Variables:
```
NEXT_PUBLIC_API_URL=https://api.demitaylornimmo.com
```

## 2. Backend API
**Deploy from**: `/packages/backend`
**Domain**: `api.demitaylornimmo.com`
**Vercel Config**: `/packages/backend/vercel.json`

### Steps:
1. Create new Vercel project
2. Connect to GitHub repo
3. Set root directory to `packages/backend`
4. Deploy

### Environment Variables:
```
DATABASE_CONNECTION_STRING=postgres://postgres.vtkekrttdxohsqqadzwu:PdiqfcDNQ1dHugRH@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require
SUPABASE_URL=https://vtkekrttdxohsqqadzwu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a2VrcnR0ZHhvaHNxcWFkend1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIzMDgsImV4cCI6MjA3NDEzODMwOH0.a4KS4UstRF-AO1I2IvpIpgsVkQivDevK5DyoDvaT0pE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0a2VrcnR0ZHhvaHNxcWFkend1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjMwOCwiZXhwIjoyMDc0MTM4MzA4fQ.kceHemv1QyTM5xu1p-NzOfQn3fqUfNfgofIKUhODx5E
JWT_SECRET=8c653503e73f6cd2afc47a6c66ec768ecd56d59f792eea58cf22178dc35de431f49087f1d79fe13218ac9ed131925493944f38c5ab522400759ffdba0769cbee
NODE_ENV=production
VAULT_ENABLED=false
FRONTEND_URL=https://demitaylornimmo.com
ADMIN_URL=https://admin.demitaylornimmo.com
```

## 3. Admin Panel
**Deploy from**: `/packages/admin`
**Domain**: `admin.demitaylornimmo.com`
**Vercel Config**: `/packages/admin/vercel.json`

### Steps:
1. Create new Vercel project
2. Connect to GitHub repo
3. Set root directory to `packages/admin`
4. Deploy

### Environment Variables:
```
VITE_API_URL=https://api.demitaylornimmo.com
```

## Domain Configuration

After deploying all three projects:

1. **Frontend**: Set custom domain to `demitaylornimmo.com`
2. **Backend**: Set custom domain to `api.demitaylornimmo.com`
3. **Admin**: Set custom domain to `admin.demitaylornimmo.com`

## Why Separate Projects?

- **Better isolation**: Each service can be deployed independently
- **Easier debugging**: Logs and errors are separated
- **Better performance**: Each service is optimized for its specific needs
- **Simpler configuration**: No complex routing between services
