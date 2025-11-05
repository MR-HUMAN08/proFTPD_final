#!/bin/bash

echo "🔍 Checking Docker Installation..."
echo ""

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    echo "   Version: $(docker --version)"
else
    echo "❌ Docker is NOT installed"
fi

echo ""

# Check Docker Compose (both versions)
if command -v docker-compose &> /dev/null; then
    echo "✅ docker-compose (standalone) is installed"
    echo "   Version: $(docker-compose --version)"
elif docker compose version &> /dev/null 2>&1; then
    echo "✅ docker compose (plugin) is installed"
    echo "   Version: $(docker compose version)"
else
    echo "❌ Docker Compose is NOT installed"
fi

echo ""

# Check if Docker daemon is running
if docker info &> /dev/null 2>&1; then
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon is NOT running"
    echo "   Try: sudo systemctl start docker"
fi

echo ""
echo "Ready to run: ./start-lab.sh"
