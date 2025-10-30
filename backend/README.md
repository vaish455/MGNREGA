# MGNREGA Backend API

# MGNREGA Backend API

Production-ready backend service for the MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data application. This service syncs data from the Government of India's Open API and provides efficient access to district-level MGNREGA performance data.

## 🏗️ Architecture

- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful Express.js server
- **Data Sync**: Background service to sync data from data.gov.in API
- **Caching**: Local database to avoid API dependency and rate limiting

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mgnrega_db?schema=public"
DATA_GOV_API_KEY="your_api_key_here"
PORT=3000
```

### 3. Setup Database

Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

Or if you want to use migrations:

```bash
npm run db:migrate
```

### 4. Sync Initial Data

Sync data for a specific state (e.g., MAHARASHTRA):

```bash
npm run sync "MAHARASHTRA" "2024-2025"
```

Or sync latest data for all states:

```bash
npm run sync -- --latest
```

### 5. Start the Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Health Check

```http
GET /api/health
```

### States

```http
GET /api/states
GET /api/states/:stateCode
```

### Districts

```http
GET /api/districts
GET /api/districts?stateCode=18
GET /api/districts/:districtCode
```

### MGNREGA Data

```http
GET /api/mgnrega-data
GET /api/mgnrega-data?districtCode=1803&finYear=2024-2025
GET /api/mgnrega-data/latest/:districtCode
GET /api/mgnrega-data/comparison/:districtCode?finYear=2024-2025
GET /api/mgnrega-data/state-average/:stateCode?finYear=2024-2025
```

### Data Sync

```http
POST /api/sync/state
Body: { "stateName": "MAHARASHTRA", "finYear": "2024-2025" }

POST /api/sync/latest

GET /api/sync/status
```

### Location Detection

```http
POST /api/location/detect-district
Body: { "latitude": 19.0760, "longitude": 72.8777 }
```

## 🔄 Data Synchronization

The application includes a robust data sync service that:

- Fetches data from data.gov.in API
- Handles pagination automatically
- Implements rate limiting (1 request per second)
- Stores data locally in PostgreSQL
- Tracks sync history and status
- Handles errors gracefully

### Sync Commands

```bash
# Sync specific state
npm run sync "MAHARASHTRA"

# Sync specific state and financial year
npm run sync "MAHARASHTRA" "2024-2025"

# Sync latest data for all states
npm run sync -- --latest
```

## 🗄️ Database Schema

### States
- State code and name
- Relationship with districts

### Districts
- District code and name
- Relationship with state and MGNREGA data

### MGNREGA Data
- Comprehensive monthly performance metrics
- Employment data (households, individuals, job cards)
- Financial data (wages, expenditure)
- Works data (completed, ongoing)
- Special categories (SC, ST, women, differently-abled)

### Sync Logs
- Tracks all sync operations
- Status, record counts, and error messages

## 🛠️ Development

### View Database

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555`

### Run Tests

```bash
npm test
```

## 📦 Deployment

### Environment Variables

Ensure these are set in production:

- `DATABASE_URL`: Production PostgreSQL connection string
- `DATA_GOV_API_KEY`: Your data.gov.in API key
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Set to "production"
- `CORS_ORIGIN`: Frontend URL

### Build

```bash
npm run build
npm start
```

### Scheduled Sync

Set up a cron job to sync data daily:

```bash
0 2 * * * cd /path/to/backend && npm run sync -- --latest
```

## 🔐 Security

- Input validation on all endpoints
- CORS configured for frontend domain
- Rate limiting on API requests
- Environment variables for sensitive data
- SQL injection protection via Prisma

## 📈 Performance

- Database indexes on frequently queried fields
- Efficient data fetching with Prisma
- Local caching reduces API dependency
- Optimized queries with selective field loading

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npm run db:push
```

### API Rate Limiting

The data.gov.in API has rate limits. The sync service automatically:
- Adds 1 second delay between requests
- Handles rate limit errors gracefully
- Stores data locally to minimize API calls

### BigInt Serialization

BigInt values are converted to strings for JSON responses to avoid serialization errors.

## 📝 License

MIT

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npm run db:generate
```

3. Push database schema:
```bash
npm run db:push
```

4. Sync initial data (for Maharashtra):
```bash
npm run sync MAHARASHTRA
```

## Development

Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/states` - Get all states
- `GET /api/districts/:stateCode` - Get districts by state
- `GET /api/mgnrega/:districtCode` - Get MGNREGA data for district
- `GET /api/summary/:districtCode` - Get district summary with comparisons
- `GET /api/compare?districtCodes=code1,code2&finYear=2024-2025` - Compare districts
- `POST /api/sync/:stateName` - Trigger manual data sync

## Data Sync

The system automatically syncs data daily at 2 AM. You can also manually trigger sync:

```bash
npm run sync "STATE_NAME"
```

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```
