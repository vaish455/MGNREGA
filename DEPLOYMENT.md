# Deployment Guide - MGNREGA Portal

Complete guide to deploying the MGNREGA Portal to a production VPS/VM.

## 📋 Prerequisites

- VPS/VM with Ubuntu 20.04 or later
- Minimum 2GB RAM, 20GB storage
- Root or sudo access
- Domain name (optional but recommended)

## 🔧 Initial Server Setup

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE mgnrega_db;
CREATE USER mgnrega_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mgnrega_db TO mgnrega_user;
\q
```

### 4. Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install PM2

```bash
sudo npm install -g pm2
```

### 6. Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 📦 Deploy Application

### 1. Clone Repository

```bash
cd /var/www
sudo git clone <your-repo-url> mgnrega
cd mgnrega
sudo chown -R $USER:$USER /var/www/mgnrega
```

### 2. Setup Backend

```bash
cd /var/www/mgnrega/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

Add to `.env`:
```env
DATABASE_URL="postgresql://mgnrega_user:your_secure_password@localhost:5432/mgnrega_db?schema=public"
DATA_GOV_API_KEY="579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
PORT=3000
NODE_ENV=production
CORS_ORIGIN="https://your-domain.com"
```

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Sync initial data (choose your state)
npm run sync "MAHARASHTRA" "2024-2025"

# Start with PM2
pm2 start src/index.js --name mgnrega-backend
pm2 save
pm2 startup
```

### 3. Setup Frontend

```bash
cd /var/www/mgnrega/frontend

# Install dependencies
npm install

# Create .env for production
nano .env
```

Add to `.env`:
```env
VITE_API_URL=https://your-domain.com/api
```

Or for IP-based access:
```env
VITE_API_URL=http://your-server-ip:3000/api
```

```bash
# Build for production
npm run build

# Create directory for frontend
sudo mkdir -p /var/www/mgnrega-frontend
sudo cp -r dist/* /var/www/mgnrega-frontend/
```

## 🌐 Configure Nginx

### Option 1: Single Domain with Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/mgnrega
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/mgnrega-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

### Option 2: IP-Based Access (No Domain)

```bash
sudo nano /etc/nginx/sites-available/mgnrega
```

Add:
```nginx
server {
    listen 80;
    server_name your_server_ip;

    location / {
        root /var/www/mgnrega-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/mgnrega /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Setup SSL (Optional but Recommended)

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

Certbot will automatically update your Nginx config for HTTPS.

## 🔄 Setup Automated Data Sync

### Create Sync Script

```bash
nano /var/www/mgnrega/sync-daily.sh
```

Add:
```bash
#!/bin/bash
cd /var/www/mgnrega/backend
npm run sync -- --latest >> /var/log/mgnrega-sync.log 2>&1
```

```bash
chmod +x /var/www/mgnrega/sync-daily.sh
```

### Add Cron Job

```bash
crontab -e
```

Add:
```
# Sync MGNREGA data daily at 2 AM
0 2 * * * /var/www/mgnrega/sync-daily.sh
```

## 📊 Monitoring

### Check Backend Status

```bash
pm2 status
pm2 logs mgnrega-backend
```

### Check Nginx Status

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Check Sync Logs

```bash
tail -f /var/log/mgnrega-sync.log
```

## 🔄 Updates and Maintenance

### Update Application

```bash
cd /var/www/mgnrega
git pull

# Update backend
cd backend
npm install
pm2 restart mgnrega-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/mgnrega-frontend/
```

### Database Backup

```bash
# Create backup
sudo -u postgres pg_dump mgnrega_db > mgnrega_backup_$(date +%Y%m%d).sql

# Restore backup
sudo -u postgres psql mgnrega_db < mgnrega_backup_20250101.sql
```

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs mgnrega-backend

# Check if port is in use
sudo lsof -i :3000

# Restart
pm2 restart mgnrega-backend
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
sudo -u postgres psql -d mgnrega_db -c "SELECT 1;"

# Check .env file
cat /var/www/mgnrega/backend/.env
```

### Nginx 502 Bad Gateway

```bash
# Check if backend is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t
```

### Frontend Not Loading

```bash
# Check Nginx is serving files
ls -la /var/www/mgnrega-frontend/

# Check Nginx config
sudo nginx -t

# Check browser console for API errors
```

## 📈 Performance Optimization

### 1. Enable Nginx Caching

Add to Nginx config:
```nginx
# Add to http block
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

# In location /api block
proxy_cache api_cache;
proxy_cache_valid 200 5m;
proxy_cache_use_stale error timeout http_500 http_502 http_503;
```

### 2. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_mgnrega_data_district_year ON mgnrega_data(district_code, fin_year);
CREATE INDEX idx_mgnrega_data_state_year ON mgnrega_data(district_code, fin_year);
```

### 3. PM2 Cluster Mode

```bash
pm2 delete mgnrega-backend
pm2 start src/index.js --name mgnrega-backend -i max
pm2 save
```

## 🔐 Security Checklist

- [ ] Change default database password
- [ ] Setup firewall (UFW)
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Secure SSH (disable root login, use keys)
- [ ] Setup fail2ban for brute force protection
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs mgnrega-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify all services are running
4. Check firewall rules: `sudo ufw status`

## 🎉 Success!

Your MGNREGA Portal should now be accessible at:
- With domain: `https://your-domain.com`
- Without domain: `http://your-server-ip`

Test the application:
1. Visit the URL
2. Select a state and district
3. Verify data loads correctly
4. Check comparisons and explanations

---

**Congratulations!** You've successfully deployed the MGNREGA Portal! 🚀
