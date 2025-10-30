# Chart.js Implementation Guide

## Overview
This document describes the Chart.js implementation in the MGNREGA Dashboard for enhanced data visualization and analysis.

## Installed Dependencies

```json
{
  "chart.js": "^4.x",
  "react-chartjs-2": "^5.x"
}
```

## Chart Components Created

### 1. **TrendChart** (`/src/components/TrendChart.jsx`)
**Purpose**: Display historical trends over time

**Features**:
- Line/Area chart with smooth curves
- Supports multiple metrics: wages, employment days, households, expenditure
- Interactive tooltips with formatted values
- Responsive design
- Color-coded by metric type

**Props**:
- `comparisonData`: Array of historical data points
- `metric`: String ('wage', 'days', 'households', 'expenditure')

**Usage**:
```jsx
<TrendChart comparisonData={comparison} metric="wage" />
```

---

### 2. **CategoryDistributionChart** (`/src/components/CategoryDistributionChart.jsx`)
**Purpose**: Show categorical data distribution

**Features**:
- Pie and Doughnut chart options
- Supports multiple categories: women participation, SC/ST workers, work status, job cards
- Percentage labels in tooltips
- Bilingual labels (Hindi/English)
- Color-coded segments

**Props**:
- `data`: MGNREGA data object
- `type`: String ('women', 'scst', 'works', 'jobcards')
- `chartType`: String ('pie', 'doughnut')

**Usage**:
```jsx
<CategoryDistributionChart 
  data={data} 
  type="women" 
  chartType="doughnut" 
/>
```

---

### 3. **BarComparisonChart** (`/src/components/BarComparisonChart.jsx`)
**Purpose**: Compare district metrics with state averages

**Features**:
- Grouped bar chart
- Side-by-side comparison
- Percentage difference calculation
- Bilingual labels with translation support
- Interactive tooltips with detailed metrics

**Props**:
- `districtData`: District MGNREGA data
- `stateAverage`: State average data
- `districtName`: Name of the district
- `stateName`: Name of the state

**Usage**:
```jsx
<BarComparisonChart 
  districtData={data}
  stateAverage={stateAverage}
  districtName={district.districtName}
  stateName={district.state?.stateName}
/>
```

---

### 4. **MetricsOverviewChart** (`/src/components/MetricsOverviewChart.jsx`)
**Purpose**: Provide a quick overview of all key metrics

**Features**:
- Multi-bar chart with color-coded metrics
- Normalized scale for better visualization
- Comprehensive metric display
- Bilingual axis labels

**Props**:
- `data`: MGNREGA data object

**Usage**:
```jsx
<MetricsOverviewChart data={data} />
```

---

## Dashboard Integration

### New Features Added to Dashboard:

1. **Chart Toggle Button**
   - Located at the top of the dashboard
   - Allows users to show/hide all charts
   - Improves page load performance
   - Reduces visual clutter when needed

2. **Metrics Overview Section**
   - Displays all key metrics in a single chart
   - Provides quick visual comparison

3. **Historical Trends Section**
   - Shows data trends over time
   - Metric selector buttons for different data types
   - Appears only when historical data is available

4. **Enhanced Women Participation**
   - Added gender distribution doughnut chart
   - Visual representation of women vs. men participation

5. **SC/ST Worker Distribution**
   - Pie chart showing worker category breakdown
   - Easy to understand demographic visualization

6. **Work Status Visualization**
   - Doughnut chart for completed vs. ongoing works
   - Clear project progress indication

7. **Enhanced State Comparison**
   - Bar chart comparison alongside existing text-based comparison
   - Interactive tooltips with percentage differences

8. **Job Card Status Chart**
   - Pie chart showing active vs. inactive job cards
   - Visual health indicator for program engagement

---

## User Benefits

### 📊 **Better Data Analysis**
- Visual patterns are easier to identify than raw numbers
- Trend analysis helps understand progress over time
- Distribution charts show proportions at a glance

### 🎯 **Improved Flexibility**
- Toggle charts on/off based on preference
- Switch between different metrics in trend charts
- Multiple chart types for different data categories

### 📱 **Responsive Design**
- All charts adapt to screen size
- Mobile-friendly visualizations
- Consistent user experience across devices

### 🌐 **Bilingual Support**
- All chart labels support Hindi and English
- Tooltips in both languages
- State/district name translations

### ⚡ **Performance Optimized**
- Charts load on demand
- Conditional rendering reduces initial load time
- Efficient data processing

---

## Technical Implementation Details

### Chart.js Configuration
- **Responsive**: All charts adapt to container size
- **MaintainAspectRatio**: Set to false for custom height control
- **Interaction Mode**: Index mode for better tooltip experience
- **Animation**: Smooth transitions and hover effects

### Color Scheme
- **Blue** (`rgba(59, 130, 246, ...)`): Households, general metrics
- **Green** (`rgba(34, 197, 94, ...)`): Completed works, active items
- **Yellow** (`rgba(234, 179, 8, ...)`): Wages, pending items
- **Red** (`rgba(239, 68, 68, ...)`): Expenditure, inactive items
- **Purple** (`rgba(147, 51, 234, ...)`): Employment days
- **Pink** (`rgba(236, 72, 153, ...)`): Women-related metrics
- **Indigo** (`rgba(99, 102, 241, ...)`): SC/ST metrics

### Tooltip Formatting
- Currency values: ₹ symbol with 2 decimal places
- Large numbers: Indian numbering system (Lakhs, Crores)
- Percentages: 1 decimal place
- Days/counts: Whole numbers

---

## Future Enhancements

### Possible Additions:
1. **Export Charts**
   - Download as PNG/PDF
   - Export data to CSV

2. **More Chart Types**
   - Radar charts for multi-metric comparison
   - Stacked bar charts for cumulative data
   - Scatter plots for correlation analysis

3. **Custom Date Ranges**
   - Allow users to select specific time periods
   - Compare different years

4. **Chart Annotations**
   - Add markers for significant events
   - Target lines for goals

5. **Print-Friendly Views**
   - Optimized chart layouts for printing
   - Report generation

---

## Troubleshooting

### Charts Not Displaying
1. Check if Chart.js and react-chartjs-2 are installed
2. Verify data is being passed correctly to components
3. Check browser console for errors
4. Ensure parent container has defined height

### Performance Issues
1. Use the chart toggle to hide charts when not needed
2. Limit historical data points if dataset is very large
3. Consider lazy loading for charts below the fold

### Styling Issues
1. Verify Tailwind classes are correct
2. Check responsive breakpoints
3. Ensure parent containers have proper dimensions

---

## Testing Recommendations

1. **Test with different districts** to ensure charts work with various data ranges
2. **Test language switching** to verify bilingual labels
3. **Test responsive behavior** on mobile, tablet, and desktop
4. **Test with missing data** to ensure graceful fallbacks
5. **Test chart interactions** (hover, tooltips, etc.)

---

## Maintenance Notes

- Chart colors follow the existing color scheme in DataCard component
- All new components use the LanguageContext for internationalization
- Charts are conditionally rendered to improve performance
- Component files follow the existing project structure

---

## Support

For issues or questions about the chart implementation:
1. Check the Chart.js documentation: https://www.chartjs.org/docs/
2. Review react-chartjs-2 documentation: https://react-chartjs-2.js.org/
3. Examine existing chart components for patterns and examples
