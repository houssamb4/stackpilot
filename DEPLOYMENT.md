# 🚀 StackPilot - Ubuntu Server Deployment Guide

Complete guide for deploying StackPilot monitoring dashboard on Ubuntu Linux server.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Production Optimization](#production-optimization)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or newer
- Minimum 2GB RAM (4GB recommended)
- 20GB available disk space
- Root or sudo access

### Required Software
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

---

## 🔧 Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker
```bash
# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (optional, requires logout/login)
sudo usermod -aG docker $USER
```

### 3. Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4. Configure Firewall (if using UFW)
```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow application ports
sudo ufw allow 3000/tcp  # Backend API
sudo ufw allow 3001/tcp  # Frontend

# Enable firewall
sudo ufw enable
```

---

## 📦 Installation

### 1. Clone Repository
```bash
cd /opt
sudo git clone <your-repository-url> stackpilot
cd stackpilot
sudo chown -R $USER:$USER .
```

### 2. Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

**Important:** Change these critical values in `.env`:
```bash
MYSQL_ROOT_PASSWORD=<strong-random-password>
MYSQL_PASSWORD=<strong-random-password>
JWT_SECRET=<generate-with-openssl-rand-base64-32>
NEXT_PUBLIC_API_URL=http://<your-server-ip>:3000
```

Generate secure JWT secret:
```bash
openssl rand -base64 32
```

---

## 🚀 Deployment

### 1. Build and Start Services
```bash
# Build images
docker-compose build

# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 2. Verify Deployment
```bash
# Check backend health
curl http://localhost:3000/api/stats/server

# Check frontend
curl http://localhost:3001

# Check MySQL
docker exec stackpilot-mysql mysql -u stackpilot -p<password> -e "SHOW DATABASES;"
```

### 3. Access Application
- Frontend: `http://<server-ip>:3001`
- Backend API: `http://<server-ip>:3000`
- Default login: Check database schema.sql for super_admin credentials

---

## ⚙️ Configuration

### Backend Configuration
Edit `backend/.env`:
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

### Frontend Configuration
Edit `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
nano frontend/.env
```

### Database Initialization
Schema is automatically loaded from `backend/database/schema.sql` on first run.

To manually reinitialize:
```bash
docker exec -i stackpilot-mysql mysql -u root -p<root-password> stackpilot < backend/database/schema.sql
```

---

## 🔒 Production Optimization

### 1. Use Nginx Reverse Proxy (Recommended)

#### Install Nginx
```bash
sudo apt install -y nginx
```

#### Configure Nginx
Create `/etc/nginx/sites-available/stackpilot`:
```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:3001;
}

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/stackpilot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### 3. Setup as System Service

Create `/etc/systemd/system/stackpilot.service`:
```ini
[Unit]
Description=StackPilot Monitoring Dashboard
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/stackpilot
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable stackpilot
sudo systemctl start stackpilot
```

### 4. Setup Automated Backups

Create `/usr/local/bin/backup-stackpilot.sh`:
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/stackpilot"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup MySQL database
docker exec stackpilot-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} stackpilot | gzip > "$BACKUP_DIR/stackpilot_db_$TIMESTAMP.sql.gz"

# Backup application files (optional)
tar -czf "$BACKUP_DIR/stackpilot_files_$TIMESTAMP.tar.gz" -C /opt stackpilot

# Delete old backups
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $TIMESTAMP"
```

Make executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-stackpilot.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-stackpilot.sh
```

---

## 🐛 Troubleshooting

### Check Container Logs
```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Database Connection Issues
```bash
# Check MySQL is running
docker-compose ps mysql

# Test connection
docker exec stackpilot-mysql mysql -u stackpilot -p<password> -e "SELECT 1"

# Check backend can reach MySQL
docker exec stackpilot-backend ping -c 3 mysql
```

### Reset Database
```bash
# WARNING: This deletes all data
docker-compose down -v
docker-compose up -d
```

### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000

# Kill process or change port in .env
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/stackpilot

# Fix Docker permissions
sudo chmod 666 /var/run/docker.sock
```

### Update Application
```bash
cd /opt/stackpilot
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoring

### View Resource Usage
```bash
# All containers
docker stats

# System resources
htop  # Install: sudo apt install htop
```

### Check Health Status
```bash
# Container health
docker inspect stackpilot-backend | grep -A 10 Health
docker inspect stackpilot-frontend | grep -A 10 Health
docker inspect stackpilot-mysql | grep -A 10 Health
```

---

## 🔐 Security Best Practices

1. **Change Default Credentials** - Update all passwords in `.env`
2. **Use Strong JWT Secret** - Generate with `openssl rand -base64 32`
3. **Enable Firewall** - Use UFW to restrict access
4. **Setup SSL/TLS** - Use Let's Encrypt for HTTPS
5. **Regular Updates** - Keep system and Docker images updated
6. **Backup Regularly** - Automate database backups
7. **Restrict SSH** - Use key-based authentication
8. **Monitor Logs** - Check for suspicious activity
9. **Limit Docker Socket Access** - Don't expose Docker API
10. **Use Secrets Management** - Consider Docker secrets or Vault

---

## 📝 Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up -d --build [service-name]

# Execute command in container
docker-compose exec [service-name] [command]

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a

# Database shell
docker-compose exec mysql mysql -u stackpilot -p
```

---

## 📞 Support

For issues and questions:
1. Check logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub issues
4. Contact support team

---

## 🎉 Deployment Complete!

Your StackPilot monitoring dashboard is now running on Ubuntu!

Access at: `http://your-server-ip:3001`
