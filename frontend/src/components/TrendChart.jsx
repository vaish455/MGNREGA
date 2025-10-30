import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TrendChart({ comparisonData, metric = 'wage' }) {
  const { t, language } = useLanguage();

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noHistoricalData') || 'No historical data available'}
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...comparisonData].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Prepare data based on metric
  const getMetricData = () => {
    switch(metric) {
      case 'wage':
        return {
          label: language === 'hi' ? 'औसत मजदूरी (₹/दिन)' : 'Average Wage (₹/day)',
          data: sortedData.map(d => parseFloat(d.averageWageRatePerDayPerPerson) || 0),
          borderColor: 'rgb(234, 179, 8)',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
        };
      case 'days':
        return {
          label: language === 'hi' ? 'औसत रोजगार दिवस' : 'Average Employment Days',
          data: sortedData.map(d => parseFloat(d.averageDaysOfEmploymentProvidedPerHousehold) || 0),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
        };
      case 'households':
        return {
          label: language === 'hi' ? 'काम करने वाले परिवार' : 'Households Worked',
          data: sortedData.map(d => parseInt(d.totalHouseholdsWorked) || 0),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        };
      case 'expenditure':
        return {
          label: language === 'hi' ? 'कुल व्यय (करोड़ ₹)' : 'Total Expenditure (Cr ₹)',
          data: sortedData.map(d => parseFloat(d.totalExp) || 0),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
        };
      default:
        return {
          label: '',
          data: [],
          borderColor: 'rgb(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        };
    }
  };

  const metricData = getMetricData();

  const labels = sortedData.map(d => {
    const date = new Date(d.createdAt);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  });

  const chartData = {
    labels,
    datasets: [{
      ...metricData,
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y;
              if (metric === 'wage' || metric === 'expenditure') {
                label += '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
              } else {
                label += value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function(value) {
            if (metric === 'wage' || metric === 'expenditure') {
              return '₹' + value.toLocaleString('en-IN');
            }
            return value.toLocaleString('en-IN');
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TrendChart;
