#!/bin/bash

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install build essentials for Sharp
echo "Installing build tools..."
npm install -g node-gyp

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!"