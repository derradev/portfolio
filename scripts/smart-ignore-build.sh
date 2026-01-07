#!/bin/bash

# Smart ignore build step script for Vercel monorepo
# Only builds packages that have actually changed
# Compares against the production branch or previous commit

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "❌ Error: Service name not provided"
  exit 1
fi

echo "🔍 Smart build check for $SERVICE..."

# Check if git is available
if ! command -v git &> /dev/null; then
  echo "⚠️  Git not available. Building anyway (fail-safe)."
  exit 1
fi

# Determine the base commit to compare against
# Try to get the production/main branch, fallback to HEAD~1
BASE_COMMIT=""
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  BASE_COMMIT="origin/main"
  echo "📊 Comparing against main branch"
elif git rev-parse --verify origin/master >/dev/null 2>&1; then
  BASE_COMMIT="origin/master"
  echo "📊 Comparing against master branch"
elif git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  BASE_COMMIT="HEAD~1"
  echo "📊 Comparing against previous commit"
else
  echo "🆕 No base commit found. Building anyway (fail-safe)."
  exit 1
fi

# Verify we can actually diff
if ! git diff --name-only --quiet $BASE_COMMIT HEAD 2>/dev/null; then
  # This is fine - it means there are changes
  true
elif [ $? -eq 128 ]; then
  # Git error (e.g., commit not found)
  echo "⚠️  Git diff error. Building anyway (fail-safe)."
  exit 1
fi

CURRENT_COMMIT="HEAD"

# Define service-specific paths
case $SERVICE in
  "frontend")
    SERVICE_PATHS=(
      "packages/frontend/"
    )
    # Specific important files
    SERVICE_FILES=(
      "packages/frontend/package.json"
      "packages/frontend/next.config.js"
      "packages/frontend/tsconfig.json"
      "packages/frontend/tailwind.config.js"
      "packages/frontend/postcss.config.js"
      "packages/frontend/.env*"
    )
    SHARED_PATHS=(
      "package.json"
      "package-lock.json"
      "yarn.lock"
      ".github/workflows/"
    )
    # Frontend might be affected by backend API changes
    DEPENDENCY_PATHS=(
      "packages/backend/src/routes/"
      "packages/backend/src/middleware/"
    )
    ;;
  "backend")
    SERVICE_PATHS=(
      "packages/backend/"
    )
    SERVICE_FILES=(
      "packages/backend/package.json"
      "packages/backend/tsconfig.json"
      "packages/backend/vercel.json"
      "packages/backend/.env*"
    )
    SHARED_PATHS=(
      "package.json"
      "package-lock.json"
      "yarn.lock"
      ".github/workflows/"
    )
    DEPENDENCY_PATHS=()
    ;;
  "admin")
    SERVICE_PATHS=(
      "packages/admin/"
    )
    SERVICE_FILES=(
      "packages/admin/package.json"
      "packages/admin/vite.config.ts"
      "packages/admin/tsconfig.json"
      "packages/admin/tailwind.config.js"
      "packages/admin/postcss.config.js"
      "packages/admin/index.html"
      "packages/admin/.env*"
    )
    SHARED_PATHS=(
      "package.json"
      "package-lock.json"
      "yarn.lock"
      ".github/workflows/"
    )
    # Admin might be affected by backend API changes
    DEPENDENCY_PATHS=(
      "packages/backend/src/routes/"
      "packages/backend/src/middleware/"
    )
    ;;
  *)
    echo "❌ Unknown service: $SERVICE"
    exit 1
    ;;
esac

# Check for changes in service-specific paths (any file in the service directory)
SERVICE_CHANGED=false
for path in "${SERVICE_PATHS[@]}"; do
  if ! git diff --name-only --quiet $BASE_COMMIT $CURRENT_COMMIT -- "$path"; then
    SERVICE_CHANGED=true
    echo "✅ Changes detected in service directory: $path"
    CHANGED_FILES=$(git diff --name-only $BASE_COMMIT $CURRENT_COMMIT -- "$path" | head -10)
    echo "$CHANGED_FILES"
    break
  fi
done

# Also check specific important files
if [ "$SERVICE_CHANGED" = false ]; then
  for file in "${SERVICE_FILES[@]}"; do
    if ! git diff --name-only --quiet $BASE_COMMIT $CURRENT_COMMIT -- "$file" 2>/dev/null; then
      SERVICE_CHANGED=true
      echo "✅ Important file changed: $file"
      break
    fi
  done
fi

# Check for changes in shared paths
SHARED_CHANGED=false
for path in "${SHARED_PATHS[@]}"; do
  if ! git diff --name-only --quiet $BASE_COMMIT $CURRENT_COMMIT -- "$path"; then
    SHARED_CHANGED=true
    echo "🌐 Shared dependency changed: $path"
    break
  fi
done

# Check for changes in dependency paths
DEPENDENCY_CHANGED=false
for path in "${DEPENDENCY_PATHS[@]}"; do
  if ! git diff --name-only --quiet $BASE_COMMIT $CURRENT_COMMIT -- "$path"; then
    DEPENDENCY_CHANGED=true
    echo "🔗 Dependency changed: $path"
    break
  fi
done

# Determine if build is needed
if [ "$SERVICE_CHANGED" = true ] || [ "$SHARED_CHANGED" = true ] || [ "$DEPENDENCY_CHANGED" = true ]; then
  echo "🚀 Build required for $SERVICE"
  echo "   - Service changes: $SERVICE_CHANGED"
  echo "   - Shared changes: $SHARED_CHANGED"
  echo "   - Dependency changes: $DEPENDENCY_CHANGED"
  exit 1
else
  echo "⏭️  No relevant changes detected for $SERVICE. Skipping build."
  exit 0
fi

