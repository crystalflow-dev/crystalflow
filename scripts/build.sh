#!/bin/bash

# Build script for CrystalFlow monorepo

set -e

echo "🏗️  Building CrystalFlow packages..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Build packages in order (respecting dependencies)
echo "📦 Building @crystalflow/types..."
cd packages/types && npm run build && cd ../..

echo "📦 Building @crystalflow/core..."
cd packages/core && npm run build && cd ../..

echo "✅ Build complete!"
