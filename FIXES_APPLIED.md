# 🔧 Fixes Applied to ProFTPD Lab

## Issues Fixed

### 1. ✅ Session Creation Issue
**Problem**: "no session was created" error  
**Root Cause**: Missing `ftp` user/group for anonymous FTP access  
**Solution**:
- Created `ftp` user and group with UID/GID 2121 (avoiding conflict with www-data GID 33)
- Set proper ownership of `/var/ftp` and subdirectories to `ftp:ftp`
- Updated ProFTPD config to use `ftp` group instead of `nogroup`

### 2. ✅ Container Auto-Shutdown Issue
**Problem**: Container shutting down automatically  
**Solution**:
- Changed restart policy to `"no"` in docker-compose.yml
- Used `exec` to run proftpd as PID 1 (keeps container alive)
- Added configuration validation before starting ProFTPD
- Added proper error handling in startup script

### 3. ✅ Network Conflict Issue
**Problem**: `Pool overlaps with other one on this address space`  
**Root Cause**: Subnet 172.20.0.0/16 already in use by another Docker network  
**Solution**:
- Changed subnet from `172.20.0.0/16` to `172.25.0.0/16`
- Updated all IP addresses:
  - Victim: 172.20.0.10 → 172.25.0.10
  - Web Interface: 172.20.0.5 → 172.25.0.5
  - Gateway: 172.20.0.1 → 172.25.0.1

### 4. ✅ Port Conflict Issue
**Problem**: Port 8080 already allocated  
**Solution**:
- Changed HTTP port mapping from `8080:80` to `8081:80`
- Updated all documentation to reflect new port

## Files Modified

### Configuration Files:
- `victim/Dockerfile` - Added ftp user/group creation
- `victim/proftpd.conf` - Updated anonymous FTP group
- `victim/startup.sh` - Added validation and error handling
- `docker-compose.yml` - Updated network subnet and port mappings

### Documentation Files:
- `README.md` - Updated all IP addresses and ports
- `EXPLOITATION_GUIDE.md` - Updated example IP addresses
- `start-lab.sh` - Updated displayed IP addresses and ports
- `test-exploit.sh` - Updated target IP address

## How to Start the Lab

### Clean Start (Recommended):
```bash
cd /home/human8/THINGS/Internship/proftpd-lab

# Remove any existing containers
docker-compose down -v

# Build and start fresh
./start-lab.sh
```

### Manual Start:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Access Points (Updated)

- **Web Interface**: http://localhost
- **FTP Service**: ftp://localhost:2121
- **HTTP Service**: http://localhost:8081
- **Victim Container IP**: 172.25.0.10
- **Web Interface IP**: 172.25.0.5

## Container Behavior

✅ **Container will now**:
- Create FTP sessions successfully
- Stay running until manually stopped
- Not auto-restart on failure
- Use non-conflicting network and ports

🛑 **To stop the container**:
```bash
./stop-lab.sh
# or
docker-compose down
```

## Testing the Fix

Once started, verify with:
```bash
# Check container is running
docker ps | grep proftpd

# Check logs for successful startup
docker logs proftpd-vulnerable

# Test FTP connection
nc 172.25.0.10 21
# or
ftp localhost 2121
```

You should see a successful ProFTPD banner with no session creation errors.
