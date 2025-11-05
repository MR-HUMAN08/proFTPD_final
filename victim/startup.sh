#!/bin/bash
set -e  # Exit on error during setup

# Create necessary directories and files
mkdir -p /var/log/proftpd
mkdir -p /var/run/proftpd
touch /var/log/proftpd/proftpd.log
touch /var/log/proftpd/xferlog
touch /var/log/proftpd/controls.log

# Ensure ftp user owns the FTP directories
chown -R ftp:ftp /var/ftp
chmod 755 /var/ftp /var/ftp/pub

# Create a welcome message
echo "Welcome to ProFTPD 1.3.5 Vulnerable Server" > /var/ftp/welcome.msg
echo "mod_copy module is enabled - Educational purposes only!" >> /var/ftp/welcome.msg
chown ftp:ftp /var/ftp/welcome.msg

# Create web directory if it doesn't exist
mkdir -p /var/www/html

# Create a test HTML file
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>ProFTPD Vulnerable Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #1a1a1a;
            color: #00ff00;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            padding: 40px;
            border: 2px solid #00ff00;
            background-color: #0a0a0a;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ProFTPD 1.3.5 Vulnerable Server</h1>
        <p>This server is running ProFTPD with mod_copy enabled.</p>
        <p>For educational purposes only!</p>
    </div>
</body>
</html>
EOF

# Set proper permissions for nginx
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

# Configure nginx to serve from /var/www/html
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/html;
    index index.html index.htm;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

# Start Nginx
echo "Starting Nginx server..."
service nginx start
if [ $? -eq 0 ]; then
    echo "✅ Nginx started successfully"
else
    echo "⚠️  Nginx failed to start, but continuing..."
fi

# Verify ProFTPD configuration
echo "Verifying ProFTPD configuration..."
proftpd -t -c /etc/proftpd/proftpd.conf
if [ $? -eq 0 ]; then
    echo "✅ ProFTPD configuration is valid"
else
    echo "❌ ProFTPD configuration has errors"
    exit 1
fi

# Turn off exit on error for the main service
set +e

# Start ProFTPD in foreground (keeps container running)
echo "Starting ProFTPD server in foreground mode..."
echo "Container will stay running until stopped manually"
exec proftpd -n -c /etc/proftpd/proftpd.conf
