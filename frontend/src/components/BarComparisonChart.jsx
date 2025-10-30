import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarComparisonChart({ districtData, stateAverage, districtName, stateName }) {
  const { t, language } = useLanguage();

  if (!districtData || !stateAverage) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noComparisonData') || 'No comparison data available'}
      </div>
    );
  }

  const formatNumber = (num) => {
    if (!num) return 0;
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(numValue) ? 0 : numValue;
  };

  const districtWage = formatNumber(districtData.averageWageRatePerDayPerPerson);
  const stateWage = formatNumber(stateAverage.averageWageRate);
  
  const districtDays = formatNumber(districtData.averageDaysOfEmploymentProvidedPerHousehold);
  const stateDays = formatNumber(stateAverage.averageDaysOfEmployment);

  const districtHouseholds = formatNumber(districtData.totalHouseholdsWorked);
  const stateHouseholds = formatNumber(stateAverage.averageHouseholdsWorked);

  const translatedDistrictName = translateDistrictName(districtName, language);
  const translatedStateName = translateStateName(stateName, language);

  const chartData = {
    labels: [
      language === 'hi' ? 'औसत मजदूरी (₹/दिन)' : 'Avg Wage (₹/day)',
      language === 'hi' ? 'औसत रोजगार दिवस' : 'Avg Employment Days',
      language === 'hi' ? 'काम करने वाले परिवार' : 'Households Worked'
    ],
    datasets: [
      {
        label: translatedDistrictName,
        data: [districtWage, districtDays, districtHouseholds / 1000], // Divide households by 1000 for better scale
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: `${translatedStateName} (${language === 'hi' ? 'औसत' : 'Avg'})`,
        data: [stateWage, stateDays, stateHouseholds / 1000], // Divide households by 1000 for better scale
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
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
          usePointStyle: true,
          pointStyle: 'circle',
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
            
            const value = context.parsed.y;
            const dataIndex = context.dataIndex;
            
            // Format based on the metric
            if (dataIndex === 0) {
              // Wage
              label += '₹' + value.toFixed(2);
            } else if (dataIndex === 1) {
              // Days
              label += value.toFixed(2) + ' days';
            } else if (dataIndex === 2) {
              // Households (in thousands)
              label += (value * 1000).toLocaleString('en-IN');
            }
            
            return label;
          },
          afterLabel: function(context) {
            const dataIndex = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            const datasets = context.chart.data.datasets;
            
            // Calculate percentage difference
            if (datasets.length === 2) {
              const districtValue = datasets[0].data[dataIndex];
              const stateValue = datasets[1].data[dataIndex];
              
              if (stateValue > 0) {
                const percentDiff = ((districtValue - stateValue) / stateValue * 100).toFixed(1);
                if (datasetIndex === 0) {
                  const arrow = percentDiff > 0 ? '↑' : percentDiff < 0 ? '↓' : '=';
                  return `${arrow} ${Math.abs(percentDiff)}% vs state avg`;
                }
              }
            }
            
            return '';
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
          callback: function(value, index, ticks) {
            return value.toFixed(0);
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '600',
          },
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
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BarComparisonChart;
