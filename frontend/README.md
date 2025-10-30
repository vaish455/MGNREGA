# MGNREGA Dashboard Frontend

A modern, interactive dashboard for visualizing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data with rich charts and graphs.

## 🆕 NEW: Chart.js Integration!

The dashboard now includes comprehensive data visualizations using Chart.js:

### ✨ Features
- 📊 **Interactive Charts**: 7 different chart types for better data analysis
- 📈 **Historical Trends**: Track changes over time with line/area charts
- 🥧 **Distribution Charts**: Pie and doughnut charts for categorical data
- 📊 **Comparison Views**: Bar charts comparing district vs state averages
- 🎨 **Beautiful Design**: Color-coded, responsive, and user-friendly
- 🌐 **Bilingual Support**: All charts support Hindi and English
- 📱 **Mobile Ready**: Works perfectly on all devices
- ⚡ **Performance Optimized**: Toggle charts on/off for faster loading

### 📊 Available Visualizations
1. **Metrics Overview Chart** - All key metrics in one view
2. **Historical Trends** - Wages, Employment Days, Households, Expenditure
3. **Gender Distribution** - Women vs Men participation
4. **SC/ST Worker Distribution** - Demographic breakdown
5. **Work Status** - Completed vs Ongoing projects
6. **District vs State Comparison** - Performance benchmarking
7. **Job Card Status** - Active vs Inactive cards

See [CHARTS_QUICKREF.md](./CHARTS_QUICKREF.md) for a quick guide on using the charts.
See [CHARTS_GUIDE.md](./CHARTS_GUIDE.md) for detailed implementation documentation.

---

## Tech Stack

### Core
- **React 19** - UI Framework
- **Vite** - Build tool with HMR and Fast Refresh
- **Tailwind CSS 4** - Utility-first styling

### Visualization
- **Chart.js 4** - Powerful charting library
- **react-chartjs-2** - React wrapper for Chart.js

### Features
- Bilingual support (Hindi/English)
- Location detection
- State and district translations
- Responsive design

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
