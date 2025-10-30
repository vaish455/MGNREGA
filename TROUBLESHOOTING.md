# Troubleshooting Guide

Common issues and their solutions.

## 🔧 Backend Issues

### Issue: "Cannot connect to database"

**Symptoms:**
```
Error: P1001: Can't reach database server
```

**Solutions:**

1. Check if PostgreSQL is running:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

2. Verify database credentials in `.env`:
```bash
cat backend/.env | grep DATABASE_URL
```

3. Test database connection:
```bash
sudo -u postgres psql -d mgnrega_db -c "SELECT 1;"
```

4. Check if database exists:
```bash
sudo -u postgres psql -l | grep mgnrega
```

5. Reset database (last resort):
```bash
sudo -u postgres psql
DROP DATABASE mgnrega_db;
CREATE DATABASE mgnrega_db;
\q
npm run db:push
```

### Issue: "Port 3000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. Find what's using the port:
```bash
lsof -i :3000
# or
sudo netstat -tulpn | grep 3000
```

2. Kill the process:
```bash
kill -9 <PID>
```

3. Or change the port in `.env`:
```env
PORT=3001
```

### Issue: "Data sync fails"

**Symptoms:**
```
Error fetching from API: 403 Forbidden
Error: Rate limit exceeded
```

**Solutions:**

1. Check API key validity:
```bash
curl "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=YOUR_KEY&format=json&limit=1"
```

2. Wait for rate limit to reset (usually 1 hour)

3. Increase delay between requests in `data-sync.service.js`:
```javascript
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds instead of 1
```

4. Sync in smaller batches:
```bash
npm run sync "MAHARASHTRA" "2024-2025"
# Wait a few hours, then sync another state
```

5. Check sync logs:
```bash
npm run dev
# Then check the console output
```

### Issue: "Prisma schema sync fails"

**Symptoms:**
```
Error: Schema migration failed
```

**Solutions:**

1. Reset and regenerate:
```bash
rm -rf backend/generated
npm run db:generate
npm run db:push
```

2. If that doesn't work, reset database:
```bash
sudo -u postgres psql
DROP DATABASE mgnrega_db;
CREATE DATABASE mgnrega_db;
GRANT ALL PRIVILEGES ON DATABASE mgnrega_db TO mgnrega_user;
\q
npm run db:push
```

### Issue: "PM2 process keeps crashing"

**Symptoms:**
```
pm2 status shows "errored" or "stopped"
```

**Solutions:**

1. Check PM2 logs:
```bash
pm2 logs mgnrega-backend
```

2. Check for errors:
```bash
pm2 describe mgnrega-backend
```

3. Restart with verbose logging:
```bash
pm2 delete mgnrega-backend
pm2 start src/index.js --name mgnrega-backend --log /var/log/mgnrega-backend.log
pm2 logs mgnrega-backend
```

4. Check if `.env` file exists:
```bash
ls -la backend/.env
```

## 🎨 Frontend Issues

### Issue: "Cannot connect to backend API"

**Symptoms:**
```
Error loading states
Network Error
CORS Error
```

**Solutions:**

1. Check if backend is running:
```bash
curl http://localhost:3000/api/health
```

2. Verify `VITE_API_URL` in frontend `.env`:
```bash
cat frontend/.env
```

3. Check browser console for CORS errors:
- Open DevTools (F12)
- Check Console tab
- Look for CORS-related errors

4. Update CORS in backend `.env`:
```env
CORS_ORIGIN="http://localhost:5173"
```

5. Restart both services:
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

### Issue: "Page shows blank/white screen"

**Symptoms:**
- White screen after loading
- "Loading..." never completes

**Solutions:**

1. Check browser console for errors:
```
F12 → Console tab
```

2. Check if API is accessible:
```bash
curl http://localhost:3000/api/states
```

3. Clear browser cache:
- Chrome: Ctrl+Shift+Delete
- Select "Cached images and files"
- Click "Clear data"

4. Rebuild frontend:
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run dev
```

### Issue: "District selector shows no data"

**Symptoms:**
- State selection works
- District list empty or shows "No districts found"

**Solutions:**

1. Check if data exists in backend:
```bash
curl http://localhost:3000/api/states
curl http://localhost:3000/api/districts?stateCode=18
```

2. Check if sync completed:
```bash
curl http://localhost:3000/api/sync/status
```

3. Sync data for the state:
```bash
cd backend
npm run sync "MAHARASHTRA" "2024-2025"
```

### Issue: "Build fails"

**Symptoms:**
```
npm run build fails with errors
```

**Solutions:**

1. Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

2. Check Node version:
```bash
node --version  # Should be 18+
```

3. Update Node if needed:
```bash
# Using nvm
nvm install 18
nvm use 18
```

## 🌐 Nginx Issues

### Issue: "502 Bad Gateway"

**Symptoms:**
- Nginx shows 502 error
- Backend not accessible through Nginx

**Solutions:**

1. Check if backend is running:
```bash
pm2 status
curl http://localhost:3000/api/health
```

2. Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

3. Test Nginx configuration:
```bash
sudo nginx -t
```

4. Restart Nginx:
```bash
sudo systemctl restart nginx
```

5. Check proxy settings in Nginx config:
```nginx
location /api {
    proxy_pass http://localhost:3000/api;  # Make sure port matches
    # ... other settings
}
```

### Issue: "404 Not Found for SPA routes"

**Symptoms:**
- Homepage works
- Refreshing on routes shows 404

**Solutions:**

Add this to Nginx config:
```nginx
location / {
    root /var/www/mgnrega-frontend;
    index index.html;
    try_files $uri $uri/ /index.html;  # This line is crucial
}
```

Then reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Issue: "SSL certificate errors"

**Symptoms:**
```
NET::ERR_CERT_AUTHORITY_INVALID
```

**Solutions:**

1. Renew Let's Encrypt certificate:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

2. Check certificate status:
```bash
sudo certbot certificates
```

3. If expired, get new certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

## 🗄️ Database Issues

### Issue: "Database queries slow"

**Symptoms:**
- API responses taking > 2 seconds
- Dashboard loads slowly

**Solutions:**

1. Add missing indexes (if not already present):
```sql
CREATE INDEX idx_mgnrega_district_year ON mgnrega_data(district_code, fin_year);
CREATE INDEX idx_district_state ON districts(state_code);
```

2. Analyze query performance:
```bash
npm run db:studio
```

3. Check database size:
```bash
sudo -u postgres psql -d mgnrega_db -c "SELECT pg_size_pretty(pg_database_size('mgnrega_db'));"
```

4. Vacuum database:
```bash
sudo -u postgres psql -d mgnrega_db -c "VACUUM ANALYZE;"
```

### Issue: "Too many connections"

**Symptoms:**
```
Error: remaining connection slots are reserved
```

**Solutions:**

1. Check active connections:
```bash
sudo -u postgres psql -d mgnrega_db -c "SELECT count(*) FROM pg_stat_activity;"
```

2. Increase max connections in PostgreSQL:
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Change: max_connections = 100 (or higher)
sudo systemctl restart postgresql
```

3. Implement connection pooling in Prisma:
```javascript
// In datasource db block of schema.prisma
connection_limit = 10
```

## 🚀 Deployment Issues

### Issue: "Application stops after closing SSH"

**Solution:**

Use PM2 to keep it running:
```bash
pm2 start src/index.js --name mgnrega-backend
pm2 save
pm2 startup  # Follow the instructions shown
```

### Issue: "Changes not reflecting"

**Solutions:**

1. For backend changes:
```bash
pm2 restart mgnrega-backend
```

2. For frontend changes:
```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/mgnrega-frontend/
```

3. Clear Nginx cache (if caching enabled):
```bash
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Out of disk space"

**Symptoms:**
```
Error: ENOSPC: no space left on device
```

**Solutions:**

1. Check disk usage:
```bash
df -h
du -sh /var/log/*
du -sh /var/www/*
```

2. Clean up logs:
```bash
sudo journalctl --vacuum-time=7d
pm2 flush
```

3. Clean npm cache:
```bash
npm cache clean --force
```

4. Remove old backups:
```bash
ls -lh *.sql
rm old_backup_*.sql
```

## 📱 Mobile Issues

### Issue: "Touch targets too small"

**Solutions:**

Buttons should be minimum 44x44px. Check component styles:
```jsx
// Ensure buttons have proper padding
className="py-4 px-8 rounded-lg text-lg"
```

### Issue: "Text too small on mobile"

**Solutions:**

Use responsive text sizes:
```jsx
// Use Tailwind responsive classes
className="text-base md:text-lg lg:text-xl"
```

### Issue: "Horizontal scroll on mobile"

**Solutions:**

1. Add to CSS:
```css
body {
  overflow-x: hidden;
}
```

2. Check for elements with fixed width:
```jsx
// Instead of fixed width
className="w-1200px"  // ❌

// Use max-width
className="max-w-7xl mx-auto px-4"  // ✅
```

## 🔍 Debugging Tips

### Enable Verbose Logging

**Backend:**
```javascript
// In src/index.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

**Frontend:**
```javascript
// In components
console.log('State:', selectedState);
console.log('Districts:', districts);
```

### Check API Responses

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test states
curl http://localhost:3000/api/states | json_pp

# Test sync status
curl http://localhost:3000/api/sync/status | json_pp
```

### Monitor Resources

```bash
# CPU and Memory
top

# Disk usage
df -h

# PM2 monitoring
pm2 monit

# Database connections
sudo -u postgres psql -d mgnrega_db -c "SELECT * FROM pg_stat_activity;"
```

## 📞 Getting Help

If you're still stuck:

1. **Check the logs:**
   - Backend: `pm2 logs mgnrega-backend`
   - Nginx: `sudo tail -f /var/log/nginx/error.log`
   - System: `sudo journalctl -xe`

2. **Search for the error:**
   - Copy the exact error message
   - Search on Google or Stack Overflow
   - Check Prisma, Express, React documentation

3. **Verify basics:**
   - All services running?
   - Environment variables set?
   - Network connectivity working?
   - Correct file permissions?

4. **Start fresh:**
   - Sometimes easiest to redeploy
   - Follow QUICKSTART.md step by step
   - Don't skip any steps

## 🎯 Prevention

To avoid issues:

- ✅ Regular backups
- ✅ Monitor disk space
- ✅ Keep logs clean
- ✅ Update regularly
- ✅ Test before deploying
- ✅ Use version control (Git)
- ✅ Document changes

---

**Still having issues?** Double-check all environment variables and ensure all services are actually running!
