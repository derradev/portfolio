# Deployment Guide - Separate Vercel Projects

This portfolio consists of 3 separate applications that should be deployed as individual Vercel projects:

## 1. Frontend (Main Website)
**Deploy from**: `/packages/frontend`
**Domain**: `william-malone.com`
**Vercel Config**: `/packages/frontend/vercel.json`

### Steps:
1. Create new Vercel project
2. Connect to GitHub repo
3. Set root directory to `packages/frontend`
4. Deploy

### Environment Variables:
```
NEXT_PUBLIC_API_URL=https://api.william-malone.com
```

## 2. Backend API
**Deploy from**: `/packages/backend`
**Domain**: `api.william-malone.com`
**Vercel Config**: `/packages/backend/vercel.json`

### Steps:
1. Create new Vercel project
2. Connect to GitHub repo
3. Set root directory to `packages/backend`
4. Deploy

### Environment Variables:
```
DATABASE_CONNECTION_STRING=postgresql://postgres.[ref]:[password]@[pooler-host]/postgres
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
JWT_SECRET=[long-random-secret]
NODE_ENV=production
VAULT_ENABLED=false
FRONTEND_URL=https://william-malone.com
ADMIN_URL=https://admin.william-malone.com
```

## 3. Admin Panel
**Deploy from**: `/packages/admin`
**Domain**: `admin.william-malone.com`
**Vercel Config**: `/packages/admin/vercel.json`

### Steps:
1. Create new Vercel project
2. Connect to GitHub repo
3. Set root directory to `packages/admin`
4. Deploy

### Environment Variables:
```
VITE_API_URL=https://api.william-malone.com
```

## Domain Configuration

After deploying all three projects:

1. **Frontend**: Set custom domain to `william-malone.com`
2. **Backend**: Set custom domain to `api.william-malone.com`
3. **Admin**: Set custom domain to `admin.william-malone.com`

## Conditional Deployments

Each service includes an `ignoreCommand` that only triggers builds when relevant files change:

- **Frontend**: Only deploys when `packages/frontend/` or shared files change
- **Backend**: Only deploys when `packages/backend/` or shared files change  
- **Admin**: Only deploys when `packages/admin/` or shared files change

This saves build minutes and prevents unnecessary deployments.

### Shared Files That Trigger All Deployments:
- `package.json` (root dependencies)
- `scripts/` (build scripts)
- `.github/` (CI/CD workflows)

## Why Separate Projects?

- **Better isolation**: Each service can be deployed independently
- **Easier debugging**: Logs and errors are separated
- **Better performance**: Each service is optimized for its specific needs
- **Simpler configuration**: No complex routing between services
- **Conditional deployments**: Only build what changed
