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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MetricsOverviewChart({ data }) {
  const { t, language } = useLanguage();

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noDataAvailable') || 'No data available'}
      </div>
    );
  }

  const formatNumber = (num) => {
    if (!num) return 0;
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(numValue) ? 0 : numValue;
  };

  // Normalize the data to different scales for better visualization
  const householdsWorked = formatNumber(data.totalHouseholdsWorked) / 1000; // in thousands
  const individualsWorked = formatNumber(data.totalIndividualsWorked) / 1000; // in thousands
  const completedWorks = formatNumber(data.numberOfCompletedWorks);
  const ongoingWorks = formatNumber(data.numberOfOngoingWorks);
  const expenditure = formatNumber(data.totalExp); // already in crores
  const avgWage = formatNumber(data.averageWageRatePerDayPerPerson);

  const chartData = {
    labels: language === 'hi' ? [
      'परिवार (हजार)',
      'व्यक्ति (हजार)',
      'पूर्ण कार्य',
      'चल रहे कार्य',
      'व्यय (करोड़)',
      'औसत मजदूरी (₹)'
    ] : [
      'Households (K)',
      'Individuals (K)',
      'Completed Works',
      'Ongoing Works',
      'Expenditure (Cr)',
      'Avg Wage (₹)'
    ],
    datasets: [
      {
        label: language === 'hi' ? 'मुख्य मेट्रिक्स' : 'Key Metrics',
        data: [
          householdsWorked,
          individualsWorked,
          completedWorks,
          ongoingWorks,
          expenditure,
          avgWage
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',   // Blue for households
          'rgba(34, 197, 94, 0.7)',    // Green for individuals
          'rgba(34, 197, 94, 0.7)',    // Green for completed works
          'rgba(234, 179, 8, 0.7)',    // Yellow for ongoing works
          'rgba(239, 68, 68, 0.7)',    // Red for expenditure
          'rgba(234, 179, 8, 0.7)',    // Yellow for wage
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: language === 'hi' ? 'प्रमुख मेट्रिक्स का अवलोकन' : 'Key Metrics Overview',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20
        }
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
            const dataIndex = context.dataIndex;
            let value = context.parsed.y;
            let label = context.label + ': ';
            
            // Format based on the metric
            if (dataIndex === 0) {
              // Households
              label += (value * 1000).toLocaleString('en-IN');
            } else if (dataIndex === 1) {
              // Individuals
              label += (value * 1000).toLocaleString('en-IN');
            } else if (dataIndex === 4) {
              // Expenditure
              label += '₹' + value.toFixed(2) + ' Cr';
            } else if (dataIndex === 5) {
              // Wage
              label += '₹' + value.toFixed(2);
            } else {
              // Works
              label += value.toFixed(0);
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
            size: 11,
          },
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: '600',
          },
          maxRotation: 45,
          minRotation: 25,
        }
      }
    },
  };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default MetricsOverviewChart;
