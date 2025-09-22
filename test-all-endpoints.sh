#!/bin/bash

# Test All API Endpoints Script
# Run this to check if all backend endpoints are working

API_BASE="http://localhost:3001"

echo "🔍 Testing All API Endpoints..."
echo "=================================="

# Test health check first
echo "1. Health Check:"
curl -s "$API_BASE/health" | jq '.' 2>/dev/null || curl -s "$API_BASE/health"
echo ""

# Test all API endpoints
endpoints=(
  "projects"
  "work-history" 
  "learning"
  "skills"
  "education"
  "certifications"
  "blog"
  "analytics"
  "feature-flags"
)

for endpoint in "${endpoints[@]}"; do
  echo "2. Testing /api/$endpoint:"
  response=$(curl -s -w "HTTP_CODE:%{http_code}" "$API_BASE/api/$endpoint")
  http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
  body=$(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')
  
  if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS ($http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body" | head -c 100
  else
    echo "❌ FAILED ($http_code)"
    echo "$body"
  fi
  echo ""
done

echo "🎯 Summary:"
echo "- If health check fails: Backend server is not running"
echo "- If all endpoints fail: Database/Supabase connection issue"  
echo "- If some endpoints fail: Individual route problems"
echo ""
echo "💡 Next steps based on results above ☝️"
