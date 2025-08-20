#!/bin/bash

# Default to wasm mode if MODE is not set
export MODE=${MODE:-wasm}

echo "=========================================="
echo "  Starting Real-time VLM Demo"
echo "  MODE=${MODE}"
echo "=========================================="

if [[ "$MODE" == "server" ]]; then
  echo "Building and running services for SERVER mode..."
  docker-compose up --build server frontend signaling
elif [[ "$MODE" == "wasm" ]]; then
  echo "Building and running services for WASM mode..."
  # Stop the server container if it's running from a previous command
  docker-compose stop server > /dev/null 2>&1 || true
  docker-compose rm -f server > /dev/null 2>&1 || true
  docker-compose up --build frontend signaling
else
  echo "Error: Invalid MODE. Please use 'server' or 'wasm'."
  exit 1
fi