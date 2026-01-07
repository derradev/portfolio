# Vercel Deployment Troubleshooting - Keepalive Endpoint

## Issue
The `/api/keepalive` endpoint is not available on Vercel after deployment.

## Quick Fixes to Try

### 1. Force a Fresh Deployment
```bash
# Create an empty commit to trigger deployment
git commit --allow-empty -m "Force Vercel redeploy for keepalive endpoint"
git push origin master
```

### 2. Check Vercel Dashboard
1. Go to Vercel Dashboard → Your Backend Project
2. Check "Deployments" tab
3. Look for any failed builds or errors
4. Check the build logs for TypeScript compilation errors

### 3. Verify File is Included
The keepalive route should be at:
- `packages/backend/src/routes/keepalive.ts`
- Imported in `packages/backend/src/vercel.ts` (line 23)
- Registered in `packages/backend/src/vercel.ts` (line 150)

### 4. Manual Deployment Trigger
1. Vercel Dashboard → Your Project
2. Go to "Deployments"
3. Click "..." on latest deployment
4. Select "Redeploy"

### 5. Check Build Logs
Look for errors like:
- "Cannot find module './routes/keepalive'"
- TypeScript compilation errors
- Missing file errors

### 6. Verify Route Registration Order
The route must be registered BEFORE the `notFound` middleware:
```typescript
app.use('/api/keepalive', keepAliveRoutes)  // ✅ Before notFound
app.use(notFound)  // ❌ After routes
```

### 7. Test Locally First
```bash
cd packages/backend
npm run dev
# Then test: curl http://localhost:3001/api/keepalive
```

### 8. Check Vercel Build Settings
- Ensure build command is correct
- Check if `ignoreCommand` is preventing builds
- Verify root directory is set correctly

### 9. Clear Vercel Cache
1. Vercel Dashboard → Settings → General
2. Clear build cache
3. Redeploy

### 10. Check Environment Variables
Ensure Supabase credentials are set in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Expected Response
When working, the endpoint should return:
```json
{
  "success": true,
  "message": "Database keep-alive successful",
  "timestamp": "2026-01-07T13:00:00.000Z",
  "database": "active"
}
```

## If Still Not Working
1. Check Vercel function logs for runtime errors
2. Verify the route file exists in the deployed build
3. Try accessing other routes to confirm the API is working
4. Check if there's a Vercel configuration issue with route handling

