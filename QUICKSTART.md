# Quick Start Guide

Get the MGNREGA Portal running in 5 minutes!

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd mgnrega-portal
```

### Step 2: Setup Database

```bash
# Create PostgreSQL database
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE mgnrega_db;
CREATE USER mgnrega_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE mgnrega_db TO mgnrega_user;
\q
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

Update `.env`:
```env
DATABASE_URL="postgresql://mgnrega_user:password123@localhost:5432/mgnrega_db?schema=public"
DATA_GOV_API_KEY="579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

```bash
# Generate Prisma client and setup database
npm run db:generate
npm run db:push

# Sync some initial data (this will take a few minutes)
npm run sync "MAHARASHTRA" "2024-2025"

# Start backend server
npm run dev
```

✅ Backend running at http://localhost:3000

### Step 4: Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default .env should work
# VITE_API_URL=http://localhost:3000/api

# Start frontend
npm run dev
```

✅ Frontend running at http://localhost:5173

### Step 5: Test the Application

1. Open http://localhost:5173 in your browser
2. You should see the welcome page
3. Click "Choose Manually" (or try location detection)
4. Select "MAHARASHTRA" as state
5. Select any district
6. View the dashboard with data!

## 🎯 What to Test

### Features to Verify:
- [ ] Welcome page loads
- [ ] Location detector appears (can skip)
- [ ] State selection works
- [ ] District selection shows districts
- [ ] Dashboard displays data
- [ ] Data cards show numbers
- [ ] MGNREGA explainer expands
- [ ] Comparison with state works
- [ ] Change district button works

### API Endpoints to Test:

```bash
# Test health check
curl http://localhost:3000/api/health

# Test states endpoint
curl http://localhost:3000/api/states

# Test sync status
curl http://localhost:3000/api/sync/status
```

## 📊 Sync More Data

To sync data for additional states:

```bash
cd backend

# Sync specific state
npm run sync "UTTAR PRADESH" "2024-2025"

# Sync all latest data (this will take a long time!)
npm run sync -- --latest
```

## 🔧 Common Issues

### Issue: "Connection refused" to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process or change PORT in backend/.env
```

### Issue: "No data available for this district"

**Solution:**
```bash
# Sync data for that state first
cd backend
npm run sync "<STATE_NAME>" "2024-2025"
```

### Issue: Frontend shows "Error loading data"

**Solution:**
1. Check backend is running: http://localhost:3000/api/health
2. Check CORS settings in backend/.env
3. Check browser console for errors
4. Verify VITE_API_URL in frontend/.env

## 🎨 Development Tips

### Backend Development

```bash
cd backend

# Watch mode (auto-restart on changes)
npm run dev

# View database
npm run db:studio

# Check sync logs
npm run sync:status
```

### Frontend Development

```bash
cd frontend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Next Steps

1. **Read the full README.md** for architecture details
2. **Check DEPLOYMENT.md** for production deployment
3. **Explore the API** at http://localhost:3000/api/
4. **Customize** the frontend for your needs
5. **Add more states** by syncing data

## 🆘 Need Help?

- Check backend logs in the terminal
- Check frontend console in browser DevTools
- Review error messages carefully
- Ensure all services are running
- Verify database connection

## 🎉 Success!

If you can see district data in the dashboard, congratulations! 🎊

You now have:
- ✅ Backend API running
- ✅ Frontend application running
- ✅ Database with synced data
- ✅ Full MGNREGA portal working locally

**Ready to deploy?** Check DEPLOYMENT.md for production setup!

---

**Happy Coding!** 💻
