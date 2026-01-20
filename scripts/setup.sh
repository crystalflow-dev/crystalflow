#!/bin/bash

# Setup script for ReactFlo development

set -e

echo "🚀 Setting up ReactFlo development environment..."

# Check Node version
echo "📋 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required"
    exit 1
fi
echo "✅ Node.js version is compatible"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build all packages
echo "🏗️  Building packages..."
./scripts/build.sh

# Make scripts executable
chmod +x scripts/*.sh

echo "✅ Setup complete! You can now start developing."
echo ""
echo "Available commands:"
echo "  npm run dev       - Start development mode with watch"
echo "  npm run build     - Build all packages"
echo "  npm test          - Run tests"
echo "  npm run lint      - Run linter"
