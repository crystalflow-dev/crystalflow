#!/bin/bash

# Test script for CrystalFlow monorepo

set -e

echo "🧪 Running tests for CrystalFlow..."

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run type checking
echo "🔍 Running type check..."
npm run typecheck

# Run unit tests
echo "🧪 Running unit tests..."
npm test

echo "✅ All tests passed!"
