# Our Voice, Our Rights - MGNREGA Data Portal

A production-ready web application that makes MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data accessible to rural Indian citizens. Built with accessibility and low-literacy users in mind.

![Project Banner](https://img.shields.io/badge/MGNREGA-Data%20Portal-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)

## 📖 Project Overview

### The Problem
The Government of India provides an Open API for MGNREGA data, but it's not accessible to common citizens who:
- Are not technically savvy
- Have low data literacy
- May have low or no literacy
- Need information in their local language
- Cannot interpret complex data structures

### Our Solution
A bilingual (Hindi/English), user-friendly web application that:
- ✅ Provides simple, visual representation of data
- ✅ Explains what the data means in plain language
- ✅ Compares district performance with state averages
- ✅ Auto-detects user's district (optional)
- ✅ Works offline with locally cached data
- ✅ Designed for mobile-first rural users

## 🏗️ Architecture

### System Design

```
┌─────────────────┐
│   data.gov.in   │  Government API
└────────┬────────┘
         │
         │ Sync Data
         ▼
┌─────────────────┐
│  Backend API    │  Express.js + Prisma
│  (Node.js)      │  - Data sync service
│                 │  - REST API endpoints
│                 │  - Rate limiting
└────────┬────────┘
         │
         │ PostgreSQL
         ▼
┌─────────────────┐
│   Database      │  Cached MGNREGA data
│  (PostgreSQL)   │  - States, Districts
│                 │  - Historical data
│                 │  - Sync logs
└─────────────────┘
         ▲
         │ API Calls
         │
┌─────────────────┐
│   Frontend      │  React + Tailwind
│   (React SPA)   │  - Bilingual UI
│                 │  - Visual data cards
│                 │  - Comparisons
└─────────────────┘
```

### Tech Stack

**Backend:**
- Node.js + Express.js
- Prisma ORM
- PostgreSQL Database
- Axios for API calls

**Frontend:**
- React 19
- Tailwind CSS
- Vite build tool
- Responsive design

**Infrastructure:**
- VPS/VM for hosting
- Nginx reverse proxy
- PM2 for process management
- SSL/TLS encryption

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mgnrega-portal
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run db:generate
npm run db:push

# Sync initial data (example: Maharashtra)
npm run sync "MAHARASHTRA" "2024-2025"

# Start backend server
npm run dev
```

Backend will run at `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Verify VITE_API_URL points to backend

# Start frontend
npm run dev
```

Frontend will run at `http://localhost:5173`

## 📊 Data Synchronization

The application syncs data from data.gov.in API to local database:

### Why Local Database?

1. **Reliability**: API might be down or rate-limited
2. **Performance**: Fast data access without API latency
3. **Offline Capability**: Works even if API is unavailable
4. **Historical Data**: Store and compare historical performance
5. **Cost-Effective**: Reduce API calls

### Sync Commands

```bash
# Sync specific state
npm run sync "MAHARASHTRA"

# Sync specific state and year
npm run sync "MAHARASHTRA" "2024-2025"

# Sync latest data for all states
npm run sync -- --latest
```

### Automated Sync

Setup a cron job to sync daily:

```bash
# Add to crontab
0 2 * * * cd /path/to/backend && npm run sync -- --latest
```

## 🎨 Design for Low-Literacy Users

### Key Design Principles

1. **Bilingual by Default**
   - Every text in Hindi and English
   - Hindi given visual prominence
   - Simple, conversational language

2. **Visual Communication**
   - Large, colorful icons
   - Emojis to represent concepts
   - Color coding for performance
   - Progress bars and comparisons

3. **Contextual Help**
   - Every metric has explanation
   - "What is MGNREGA?" section
   - Examples and comparisons
   - No jargon or technical terms

4. **Simple Navigation**
   - Maximum 3 clicks to any data
   - Clear "Back" buttons
   - No complex menus
   - Large touch targets (mobile)

5. **Progressive Disclosure**
   - Show most important info first
   - Hide complexity behind expandable sections
   - No information overload

## 📱 Features

### For Citizens

- **District Discovery**: Auto-detect or manually select district
- **Performance Dashboard**: View key MGNREGA metrics
- **Comparisons**: See how your district compares to state average
- **Historical Trends**: Track performance over time
- **Scheme Information**: Learn about MGNREGA rights and benefits
- **Mobile Friendly**: Access on any device

### For Administrators

- **Data Sync**: Automated or manual data synchronization
- **Sync Monitoring**: Track sync status and history
- **API Endpoints**: RESTful API for data access
- **Scalability**: Handles millions of users

## 🔒 Security & Privacy

- No user data collection
- No authentication required
- HTTPS encryption in production
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for security

## 🚀 Deployment

### Option 1: Single VPS (Recommended for Start)

**Requirements:**
- 2GB RAM minimum
- 20GB storage
- Ubuntu 20.04+

**Setup:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Nginx
sudo apt-get install nginx

# Install PM2
sudo npm install -g pm2

# Clone and setup project
git clone <your-repo>
cd mgnrega-portal

# Setup backend
cd backend
npm install
npm run build
pm2 start src/index.js --name mgnrega-backend

# Setup frontend
cd ../frontend
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/mgnrega

# Copy dist/ to /var/www/mgnrega
sudo cp -r dist/* /var/www/mgnrega/

# Restart services
sudo systemctl restart nginx
pm2 save
pm2 startup
```

### Option 2: Separate Servers

- **Backend**: Node.js server on one VPS
- **Database**: Managed PostgreSQL (e.g., AWS RDS)
- **Frontend**: Static hosting (Netlify, Vercel, CloudFlare Pages)

### Option 3: Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📈 Performance Optimizations

- Database indexing on frequently queried fields
- Connection pooling
- Data pagination
- Frontend code splitting
- Image optimization
- Gzip compression
- CDN for static assets

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Sync status endpoint: `/api/sync/status`
- Database connection monitoring
- Error logging
- Performance metrics

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 API Documentation

### States

- `GET /api/states` - List all states
- `GET /api/states/:stateCode` - Get state details

### Districts

- `GET /api/districts` - List all districts
- `GET /api/districts/:districtCode` - Get district details

### MGNREGA Data

- `GET /api/mgnrega-data` - Get data with filters
- `GET /api/mgnrega-data/latest/:districtCode` - Latest district data
- `GET /api/mgnrega-data/comparison/:districtCode` - Historical comparison
- `GET /api/mgnrega-data/state-average/:stateCode` - State averages

### Data Sync

- `POST /api/sync/state` - Sync specific state
- `POST /api/sync/latest` - Sync latest data
- `GET /api/sync/status` - Get sync status

## 🤝 Contributing

This is a take-home project, but contributions are welcome:

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For issues or questions:
- Create an issue on GitHub
- Check documentation in `/backend/README.md` and `/frontend/README_MGNREGA.md`

## 🎯 Future Roadmap

- [ ] Voice navigation for illiterate users
- [ ] Support for more Indian languages
- [ ] SMS notifications for updates
- [ ] Offline-first PWA
- [ ] Data export (PDF, image)
- [ ] District-to-district comparison
- [ ] Year-over-year trend analysis
- [ ] Mobile app (React Native)

## 📞 Contact

Built with ❤️ for rural India

---

**Data Source**: Ministry of Rural Development, Government of India
**API**: https://data.gov.in/
