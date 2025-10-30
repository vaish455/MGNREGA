# MGNREGA Frontend - Our Voice, Our Rights

A user-friendly, accessible web application for viewing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) district-level performance data. Designed specifically for low-literacy rural Indian population.

## 🎯 Design Philosophy

### Accessibility First
- **Bilingual Interface**: All content in both Hindi and English
- **Large Text**: Easy-to-read fonts and generous spacing
- **Visual Icons**: Emojis and icons to aid understanding
- **Simple Navigation**: Minimal clicks, clear pathways
- **Color-Coded Data**: Visual cues for better comprehension

### Key Features
- 📍 **Auto-Location Detection**: Automatically detect user's district (optional)
- 🗺️ **Easy District Selection**: Simple two-step selection (State → District)
- 📊 **Visual Data Presentation**: Cards with icons, colors, and simple explanations
- 📈 **Comparisons**: Compare your district with state average
- 📚 **MGNREGA Explainer**: Comprehensive explanation of the scheme in simple language
- 📱 **Mobile Responsive**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Update the API URL if different:

```env
VITE_API_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with branding
│   │   ├── LocationDetector.jsx    # Geolocation-based district detection
│   │   ├── DistrictSelector.jsx    # Manual district selection
│   │   ├── Dashboard.jsx           # Main dashboard with all data
│   │   ├── DataCard.jsx            # Reusable data display card
│   │   ├── ExplainerBox.jsx        # MGNREGA scheme explainer
│   │   └── ComparisonChart.jsx     # District vs State comparison
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # App entry point
│   ├── index.css                   # Global styles
│   └── App.css                     # Component styles
├── public/                         # Static assets
├── .env                           # Environment variables
└── package.json                   # Dependencies
```

## 🎨 Design Decisions for Low-Literacy Users

### 1. **Bilingual Content**
Every piece of text is shown in both Hindi and English, with Hindi given prominence as the primary language.

### 2. **Visual Hierarchy**
- Large, bold numbers for key metrics
- Icons and emojis to represent concepts
- Color coding (green = good, yellow = caution, red = needs attention)

### 3. **Contextual Explanations**
Each data point includes a simple explanation of what it means and why it matters.

### 4. **Progressive Disclosure**
Complex information (like "What is MGNREGA?") is hidden behind expandable sections to avoid overwhelming users.

### 5. **Real-World Context**
Comparisons with state averages help users understand their district's performance in relatable terms.

### 6. **Minimalist Navigation**
- No complex menus
- Clear "Back" or "Change District" buttons
- Linear flow: Home → Select District → View Data

## 🌐 API Integration

The frontend connects to the backend API at `VITE_API_URL`:

### Endpoints Used
- `GET /api/states` - List all states
- `GET /api/districts?stateCode={code}` - Get districts by state
- `GET /api/mgnrega-data/latest/{districtCode}` - Get latest district data
- `GET /api/mgnrega-data/comparison/{districtCode}` - Get historical comparison
- `GET /api/mgnrega-data/state-average/{stateCode}` - Get state averages

## 🎨 Color Scheme

Based on the Indian flag colors:
- **Orange (#f97316)**: Energy, courage
- **White**: Peace, truth
- **Green (#16a34a)**: Growth, prosperity

Additional colors:
- Blue: Information
- Yellow: Caution
- Red: Attention needed
- Purple: Special features

## 📱 Responsive Design

The app is fully responsive and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## ♿ Accessibility Features

- Large touch targets (minimum 44x44px)
- High contrast text
- Keyboard navigation support
- Screen reader friendly
- No time-limited interactions
- Clear focus indicators

## 🚀 Deployment

### Static Hosting (Recommended)

Build the app and deploy to:
- **Netlify**: Drop the `dist` folder
- **Vercel**: Connect your repo
- **AWS S3 + CloudFront**: Upload `dist` folder
- **Nginx**: Serve from `dist` folder

### Environment Variables for Production

```env
VITE_API_URL=https://your-backend-api.com/api
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/mgnrega-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 License

MIT
