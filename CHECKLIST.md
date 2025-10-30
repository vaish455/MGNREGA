# Pre-Deployment Checklist

Use this checklist before deploying to production.

## 🔧 Backend Checklist

### Environment Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `DATABASE_URL` configured with production credentials
- [ ] `DATA_GOV_API_KEY` updated (get your own key from data.gov.in)
- [ ] `PORT` configured (default: 3000)
- [ ] `NODE_ENV` set to "production"
- [ ] `CORS_ORIGIN` set to your frontend URL

### Database Setup
- [ ] PostgreSQL installed and running
- [ ] Database created (`mgnrega_db`)
- [ ] Database user created with proper permissions
- [ ] Prisma client generated (`npm run db:generate`)
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Initial data synced (at least one state)

### Code & Dependencies
- [ ] All npm packages installed (`npm install`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Health check endpoint works (`/api/health`)
- [ ] At least one state's data synced

### Testing
- [ ] GET `/api/states` returns data
- [ ] GET `/api/districts` returns data
- [ ] GET `/api/mgnrega-data/latest/{districtCode}` works
- [ ] Sync service works (`npm run sync "<STATE>" "2024-2025"`)
- [ ] Sync status endpoint works (`/api/sync/status`)

## 🎨 Frontend Checklist

### Environment Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `VITE_API_URL` points to correct backend URL
  - Local: `http://localhost:3000/api`
  - Production: `https://your-domain.com/api` or `http://your-ip:3000/api`

### Build & Dependencies
- [ ] All npm packages installed (`npm install`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No errors in browser console

### Testing
- [ ] Welcome page loads correctly
- [ ] Location detector shows up
- [ ] State selection works
- [ ] District selection loads districts
- [ ] Dashboard displays data
- [ ] All data cards render correctly
- [ ] MGNREGA explainer expands/collapses
- [ ] Comparison charts show
- [ ] "Change District" button works
- [ ] Responsive on mobile, tablet, desktop

## 🌐 Infrastructure Checklist

### Server Setup
- [ ] VPS/VM provisioned (minimum 2GB RAM, 20GB storage)
- [ ] Ubuntu 20.04+ installed
- [ ] System updated (`sudo apt update && sudo apt upgrade`)
- [ ] Firewall configured (`sudo ufw enable`)
- [ ] SSH access working
- [ ] Non-root user created (recommended)

### Software Installation
- [ ] Node.js 18+ installed
- [ ] npm working
- [ ] PostgreSQL 14+ installed
- [ ] Nginx installed
- [ ] PM2 installed globally (`sudo npm install -g pm2`)
- [ ] Git installed

### Security
- [ ] Firewall rules configured (SSH, HTTP, HTTPS)
- [ ] Strong database password set
- [ ] SSH key authentication (disable password auth)
- [ ] fail2ban installed (optional but recommended)
- [ ] SSL certificate obtained (Let's Encrypt)

## 🚀 Deployment Checklist

### Backend Deployment
- [ ] Code cloned to server
- [ ] Dependencies installed
- [ ] `.env` configured for production
- [ ] Database schema applied
- [ ] Initial data synced
- [ ] PM2 process started
- [ ] PM2 set to auto-restart
- [ ] PM2 startup script configured

### Frontend Deployment
- [ ] Code cloned/copied to server
- [ ] Dependencies installed
- [ ] `.env` configured for production
- [ ] Production build created
- [ ] Built files copied to web root
- [ ] Correct file permissions set

### Nginx Configuration
- [ ] Nginx config file created
- [ ] Frontend static files serving configured
- [ ] Reverse proxy to backend configured
- [ ] Gzip compression enabled
- [ ] SSL/TLS configured (if using domain)
- [ ] Nginx configuration tested (`sudo nginx -t`)
- [ ] Nginx restarted

### Domain & SSL (if using domain)
- [ ] Domain DNS pointing to server IP
- [ ] SSL certificate obtained (Certbot)
- [ ] HTTPS working
- [ ] HTTP to HTTPS redirect configured
- [ ] Certificate auto-renewal tested

## 🔄 Post-Deployment Checklist

### Verification
- [ ] Application accessible via URL
- [ ] Health check endpoint responding
- [ ] Can select state and district
- [ ] Data loads on dashboard
- [ ] All features working
- [ ] No errors in logs
- [ ] Mobile responsive working

### Monitoring Setup
- [ ] Cron job for daily data sync configured
- [ ] PM2 monitoring working
- [ ] Nginx logs accessible
- [ ] Database backup strategy in place
- [ ] Sync logs being written

### Performance
- [ ] Page load time acceptable (< 3s)
- [ ] API response time good (< 500ms)
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] PM2 cluster mode (optional, for high traffic)

## 📊 Data Checklist

### Initial Data Sync
- [ ] At least one state fully synced
- [ ] Multiple districts have data
- [ ] Latest financial year data available
- [ ] Historical data synced (optional)
- [ ] Sync completed without errors

### Data Quality
- [ ] States table populated
- [ ] Districts table populated
- [ ] MGNREGA data table has records
- [ ] Sync logs table tracking operations
- [ ] No NULL values in critical fields

### Data Maintenance
- [ ] Daily sync schedule configured
- [ ] Sync logs being monitored
- [ ] Error notifications setup (optional)
- [ ] Database backup schedule configured

## 🔒 Security Checklist

### Server Security
- [ ] Only necessary ports open (22, 80, 443)
- [ ] SSH password authentication disabled
- [ ] Strong passwords for all services
- [ ] Regular security updates scheduled
- [ ] fail2ban configured
- [ ] Server logs monitored

### Application Security
- [ ] API keys not exposed in client code
- [ ] Environment variables used for secrets
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (via Prisma)
- [ ] Rate limiting configured

### Database Security
- [ ] Strong database password
- [ ] Database not publicly accessible
- [ ] Regular backups configured
- [ ] Backup restoration tested

## 📝 Documentation Checklist

### For Users
- [ ] Clear instructions on how to use
- [ ] FAQ available
- [ ] Contact information provided
- [ ] Troubleshooting guide

### For Developers/Maintainers
- [ ] README.md complete
- [ ] Deployment guide available
- [ ] API documentation complete
- [ ] Code comments adequate
- [ ] Architecture documented

## 🎯 Final Pre-Launch Checks

### Functionality
- [ ] All core features working
- [ ] No broken links or images
- [ ] Forms submit correctly
- [ ] Error messages clear and helpful
- [ ] Loading states show properly

### Performance
- [ ] Fast page loads
- [ ] Smooth interactions
- [ ] No lag on mobile
- [ ] Images optimized
- [ ] Database queries efficient

### User Experience
- [ ] Intuitive navigation
- [ ] Clear call-to-actions
- [ ] Bilingual content correct
- [ ] Icons and colors meaningful
- [ ] Explanations helpful

### Cross-Browser Testing
- [ ] Works on Chrome
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on Edge
- [ ] Works on mobile browsers

### Mobile Testing
- [ ] Responsive on different screen sizes
- [ ] Touch targets large enough
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] All features accessible

## ✅ Launch!

Once all items are checked:

1. **Inform stakeholders** - Let people know it's live
2. **Monitor closely** - Watch logs and metrics for first 24-48 hours
3. **Be ready to respond** - Have a plan for urgent issues
4. **Gather feedback** - Ask early users for feedback
5. **Iterate** - Make improvements based on real usage

## 📞 Emergency Contacts

Before launch, prepare:
- [ ] Server provider support contact
- [ ] Database backup location documented
- [ ] Rollback procedure documented
- [ ] Emergency contact list created
- [ ] Incident response plan ready

## 🎉 Post-Launch

After successful launch:
- [ ] Announce on social media (if applicable)
- [ ] Monitor user feedback
- [ ] Track performance metrics
- [ ] Plan regular maintenance
- [ ] Schedule feature updates

---

**Ready to Launch?** If all critical items are checked, you're good to go! 🚀

Remember: You can always improve and iterate after launch. Don't let perfection be the enemy of good!
