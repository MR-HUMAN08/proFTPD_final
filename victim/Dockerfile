FROM debian:stretch-slim

# Fix repositories for archived Debian Stretch
RUN echo "deb http://archive.debian.org/debian/ stretch main" > /etc/apt/sources.list && \
    echo "deb http://archive.debian.org/debian-security stretch/updates main" >> /etc/apt/sources.list && \
    echo "Acquire::Check-Valid-Until \"false\";" > /etc/apt/apt.conf.d/99no-check-valid

# Install necessary packages
RUN apt-get update && apt-get install -y \
    proftpd \
    proftpd-mod-vroot \
    nginx \
    wget \
    net-tools \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Create ftp user and group for anonymous FTP (use GID 2121 to avoid conflicts)
RUN if ! getent group ftp; then groupadd -g 2121 ftp; fi && \
    if ! id ftp >/dev/null 2>&1; then useradd -u 2121 -g ftp -d /var/ftp -s /bin/false ftp; fi



# Create FTP directories
RUN mkdir -p /var/ftp/pub && \
    chmod 755 /var/ftp && \
    chmod 755 /var/ftp/pub && \
    chown -R ftp:ftp /var/ftp

# Configure ProFTPD with mod_copy enabled
COPY proftpd.conf /etc/proftpd/proftpd.conf

# Setup web directory with proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod 755 /var/www/html

# Create a test user for FTP (optional)
RUN useradd -m -d /var/ftp -s /bin/false ftpuser && \
    echo "ftpuser:password123" | chpasswd

# Copy startup script
COPY startup.sh /startup.sh
RUN chmod +x /startup.sh

# Expose FTP and HTTP ports
EXPOSE 21 20 80

# Start services
CMD ["/startup.sh"]
