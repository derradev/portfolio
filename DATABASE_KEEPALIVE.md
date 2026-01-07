# Database Keep-Alive System

This project includes an automated system to keep the Supabase free-tier database active by pinging it every 3 days.

## How It Works

### 1. Keep-Alive Endpoint
- **Endpoint**: `GET /api/keepalive`
- **Purpose**: Performs a lightweight database query to keep the connection active
- **Location**: `packages/backend/src/routes/keepalive.ts`

The endpoint:
- Queries the `blog_posts` table (lightweight query)
- Returns success status and timestamp
- Handles errors gracefully

### 2. Scheduled GitHub Actions Workflow
- **File**: `.github/workflows/keep-database-alive.yml`
- **Schedule**: Runs every 3 days at 2 AM UTC
- **Cron Expression**: `0 2 */3 * *`

The workflow:
- Pings the keep-alive endpoint
- Logs the response
- Can be manually triggered from GitHub Actions UI

## Manual Testing

You can test the keep-alive endpoint manually:

```bash
# Test locally (if running backend)
curl http://localhost:3001/api/keepalive

# Test production
curl https://api.william-malone.com/api/keepalive
```

Expected response:
```json
{
  "success": true,
  "message": "Database keep-alive successful",
  "timestamp": "2026-01-07T13:00:00.000Z",
  "database": "active"
}
```

## Configuration

### GitHub Actions
The workflow uses the `API_URL` secret if configured, otherwise defaults to:
- `https://api.william-malone.com`

To set a custom API URL:
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add a new secret: `API_URL` with your API URL

### Manual Trigger
You can manually trigger the workflow:
1. Go to GitHub Actions tab
2. Select "Keep Database Alive" workflow
3. Click "Run workflow"

## Why Every 3 Days?

Supabase free tier databases typically go to sleep after 7 days of inactivity. Running every 3 days ensures:
- The database stays active
- Minimal resource usage
- Cost-effective (free GitHub Actions)

## Monitoring

Check workflow runs in:
- GitHub Actions → Keep Database Alive workflow
- Look for green checkmarks indicating successful pings

## Troubleshooting

If the keep-alive fails:
1. Check if the API is accessible
2. Verify the API URL is correct
3. Check backend logs for errors
4. Ensure Supabase credentials are configured

