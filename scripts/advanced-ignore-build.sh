#!/bin/bash

# Advanced ignore build step script for Vercel monorepo
# Handles shared dependencies and cross-service changes

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "❌ Error: Service name not provided"
  exit 1
fi

echo "🔍 Advanced check for $SERVICE deployment..."

# Get commits to compare
CURRENT_COMMIT=$(git rev-parse HEAD)
if git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
else
  echo "🆕 Initial commit detected. Proceeding with build."
  exit 1
fi

# Define service-specific paths and shared paths
case $SERVICE in
  "frontend")
    SERVICE_PATHS="packages/frontend/"
    SHARED_PATHS="package.json package-lock.json scripts/ .github/"
    ;;
  "backend")
    SERVICE_PATHS="packages/backend/"
    SHARED_PATHS="package.json package-lock.json scripts/ .github/"
    ;;
  "admin")
    SERVICE_PATHS="packages/admin/"
    SHARED_PATHS="package.json package-lock.json scripts/ .github/"
    ;;
  *)
    echo "❌ Unknown service: $SERVICE"
    exit 1
    ;;
esac

# Check for changes in service-specific paths
SERVICE_CHANGES=$(git diff --name-only $PREVIOUS_COMMIT $CURRENT_COMMIT | grep -E "^($SERVICE_PATHS)")

# Check for changes in shared paths that affect all services
SHARED_CHANGES=$(git diff --name-only $PREVIOUS_COMMIT $CURRENT_COMMIT | grep -E "^($SHARED_PATHS)")

# Check for changes in dependencies that might affect this service
DEPENDENCY_CHANGES=""
if [ "$SERVICE" = "frontend" ] || [ "$SERVICE" = "admin" ]; then
  # Frontend and admin might be affected by backend API changes
  DEPENDENCY_CHANGES=$(git diff --name-only $PREVIOUS_COMMIT $CURRENT_COMMIT | grep -E "^packages/backend/src/(routes|middleware|types)/")
fi

ALL_CHANGES="$SERVICE_CHANGES$SHARED_CHANGES$DEPENDENCY_CHANGES"

if [ -z "$ALL_CHANGES" ]; then
  echo "⏭️  No relevant changes detected for $SERVICE. Skipping build."
  echo "📊 Checked paths:"
  echo "   - Service: $SERVICE_PATHS"
  echo "   - Shared: $SHARED_PATHS"
  [ -n "$DEPENDENCY_CHANGES" ] && echo "   - Dependencies: Backend API routes"
  exit 0
else
  echo "✅ Relevant changes detected for $SERVICE:"
  [ -n "$SERVICE_CHANGES" ] && echo "🔧 Service changes:" && echo "$SERVICE_CHANGES"
  [ -n "$SHARED_CHANGES" ] && echo "🌐 Shared changes:" && echo "$SHARED_CHANGES"
  [ -n "$DEPENDENCY_CHANGES" ] && echo "🔗 Dependency changes:" && echo "$DEPENDENCY_CHANGES"
  echo "🚀 Proceeding with build..."
  exit 1
fi
