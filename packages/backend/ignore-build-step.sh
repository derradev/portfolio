#!/bin/bash

# Smart ignore build step - only build if changes detected
# Uses the smart-ignore-build.sh script from root

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

bash "$ROOT_DIR/scripts/smart-ignore-build.sh" backend
