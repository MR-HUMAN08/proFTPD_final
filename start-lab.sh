#!/bin/bash

# ProFTPD Lab Startup Script

echo "╔══════════════════════════════════════════════════════╗"
echo "║     ProFTPD 1.3.5 mod_copy RCE Lab Launcher         ║"
echo "║         For Educational Purposes Only               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed (check both versions)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker."
    exit 1
fi

echo "✅ Docker environment detected"
echo ""

# Build and start the lab
echo "🔨 Building vulnerable container..."
$DOCKER_COMPOSE build --quiet

echo "🚀 Starting lab environment..."
$DOCKER_COMPOSE up -d

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 5

# Check container status
if docker ps | grep -q proftpd-vulnerable; then
    echo "✅ Vulnerable ProFTPD container is running"
else
    echo "❌ Failed to start ProFTPD container"
    exit 1
fi

if docker ps | grep -q proftpd-lab-interface; then
    echo "✅ Web interface is running"
else
    echo "❌ Failed to start web interface"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║                  Lab Ready! 🎯                       ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "📡 Access Points:"
echo "  • Web Interface:  http://localhost"
echo "  • FTP Service:    ftp://localhost:2121"
echo "  • HTTP Service:   http://localhost:8081"
echo ""
echo "🎮 Container IPs:"
echo "  • Victim Machine: 172.25.0.10"
echo "  • Web Interface:  172.25.0.5"
echo ""
echo "💡 Quick Commands:"
echo "  • View logs:      $DOCKER_COMPOSE logs -f"
echo "  • Stop lab:       $DOCKER_COMPOSE down"
echo "  • Clean up:       $DOCKER_COMPOSE down -v"
echo ""
echo "📖 For exploitation guidance, see README.md"
echo ""
echo "Happy Hacking! 🐛"
