#!/bin/bash

# Ignore build step script for Vercel monorepo
# Usage: bash ignore-build-step.sh <service-name>
# Returns exit code 0 to skip build, exit code 1 to proceed with build

SERVICE=$1

if [ -z "$SERVICE" ]; then
  echo "❌ Error: Service name not provided"
  exit 1
fi

echo "🔍 Checking if $SERVICE should be deployed..."

# Get the current commit and the previous commit
CURRENT_COMMIT=$(git rev-parse HEAD)
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)

echo "📊 Comparing commits: $PREVIOUS_COMMIT -> $CURRENT_COMMIT"

# Check if there are changes in the specific service directory
CHANGES=$(git diff --name-only $PREVIOUS_COMMIT $CURRENT_COMMIT | grep -E "^packages/$SERVICE/|^scripts/|^package\.json$|^\.github/")

if [ -z "$CHANGES" ]; then
  echo "⏭️  No changes detected in $SERVICE or shared files. Skipping build."
  exit 0
else
  echo "✅ Changes detected in $SERVICE:"
  echo "$CHANGES"
  echo "🚀 Proceeding with build..."
  exit 1
fi
