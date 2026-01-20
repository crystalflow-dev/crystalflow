#!/bin/bash

# Build script for ReactFlo monorepo

set -e

echo "🏗️  Building ReactFlo packages..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Build packages in order (respecting dependencies)
echo "📦 Building @reactflo/types..."
cd packages/types && npm run build && cd ../..

echo "📦 Building @reactflo/core..."
cd packages/core && npm run build && cd ../..

echo "✅ Build complete!"
