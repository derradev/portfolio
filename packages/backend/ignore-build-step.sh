#!/bin/bash

# Smart ignore build step - only build if changes detected
# Uses the smart-ignore-build.sh script from root

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to root (two levels up from packages/backend/)
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Change to root directory to ensure git commands work
cd "$ROOT_DIR" || {
  echo "⚠️  Could not navigate to root directory"
  echo "🚀 Building anyway (fail-safe)"
  exit 1
}

# Check if the smart ignore script exists
SMART_SCRIPT="$ROOT_DIR/scripts/smart-ignore-build.sh"

if [ ! -f "$SMART_SCRIPT" ]; then
  echo "⚠️  Smart ignore script not found at $SMART_SCRIPT"
  echo "🚀 Building anyway (fail-safe)"
  exit 1
fi

# Make sure script is executable
chmod +x "$SMART_SCRIPT" 2>/dev/null || true

# Run the smart ignore script from root directory
bash "$SMART_SCRIPT" backend
