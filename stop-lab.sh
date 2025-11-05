#!/bin/bash

# ProFTPD Lab Shutdown Script

echo "╔══════════════════════════════════════════════════════╗"
echo "║       ProFTPD Lab Shutdown & Cleanup                ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check if Docker Compose is installed (check both versions)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose is not installed."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running."
    exit 1
fi

echo "🛑 Stopping lab containers..."
$DOCKER_COMPOSE down

echo ""
echo "Do you want to remove volumes and clean up completely? (y/n)"
read -r response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    echo "🧹 Performing complete cleanup..."
    $DOCKER_COMPOSE down -v
    echo "✅ All containers, networks, and volumes removed"
else
    echo "✅ Containers stopped (volumes preserved)"
fi

echo ""
echo "Lab shutdown complete!"
