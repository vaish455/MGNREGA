import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryDistributionChart({ data, type = 'women', chartType = 'doughnut' }) {
  const { t, language } = useLanguage();

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noDataAvailable') || 'No data available'}
      </div>
    );
  }

  const getChartData = () => {
    switch(type) {
      case 'women': {
        const womenPersonDays = parseInt(data.womenPersondays) || 0;
        const totalPersonDays = parseInt(data.persondaysOfCentralLiabilitySoFar) || 1;
        const menPersonDays = totalPersonDays - womenPersonDays;
        
        return {
          labels: language === 'hi' 
            ? ['महिला कार्य दिवस', 'पुरुष कार्य दिवस']
            : ['Women Person-Days', 'Men Person-Days'],
          datasets: [{
            data: [womenPersonDays, menPersonDays > 0 ? menPersonDays : 0],
            backgroundColor: [
              'rgba(236, 72, 153, 0.8)',
              'rgba(59, 130, 246, 0.8)',
            ],
            borderColor: [
              'rgba(236, 72, 153, 1)',
              'rgba(59, 130, 246, 1)',
            ],
            borderWidth: 2,
          }],
        };
      }
      
      case 'scst': {
        const scWorkers = parseInt(data.scWorkersAgainstActiveWorkers) || 0;
        const stWorkers = parseInt(data.stWorkersAgainstActiveWorkers) || 0;
        const totalActiveWorkers = parseInt(data.totalNoOfActiveWorkers) || 1;
        const otherWorkers = totalActiveWorkers - scWorkers - stWorkers;
        
        return {
          labels: language === 'hi'
            ? ['SC कामगार', 'ST कामगार', 'अन्य कामगार']
            : ['SC Workers', 'ST Workers', 'Other Workers'],
          datasets: [{
            data: [scWorkers, stWorkers, otherWorkers > 0 ? otherWorkers : 0],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(99, 102, 241, 0.8)',
              'rgba(156, 163, 175, 0.8)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(156, 163, 175, 1)',
            ],
            borderWidth: 2,
          }],
        };
      }
      
      case 'works': {
        const completedWorks = parseInt(data.numberOfCompletedWorks) || 0;
        const ongoingWorks = parseInt(data.numberOfOngoingWorks) || 0;
        
        return {
          labels: language === 'hi'
            ? ['पूर्ण कार्य', 'चल रहे कार्य']
            : ['Completed Works', 'Ongoing Works'],
          datasets: [{
            data: [completedWorks, ongoingWorks],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(234, 179, 8, 0.8)',
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(234, 179, 8, 1)',
            ],
            borderWidth: 2,
          }],
        };
      }
      
      case 'jobcards': {
        const activeJobCards = parseInt(data.totalNoOfActiveJobCards) || 0;
        const totalJobCards = parseInt(data.totalNoOfJobCardsIssued) || 1;
        const inactiveJobCards = totalJobCards - activeJobCards;
        
        return {
          labels: language === 'hi'
            ? ['सक्रिय जॉब कार्ड', 'निष्क्रिय जॉब कार्ड']
            : ['Active Job Cards', 'Inactive Job Cards'],
          datasets: [{
            data: [activeJobCards, inactiveJobCards > 0 ? inactiveJobCards : 0],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
          }],
        };
      }
      
      default:
        return {
          labels: [],
          datasets: [],
        };
    }
  };

  const chartData = getChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 13,
            weight: '600',
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
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            
            return `${label}: ${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      },
    },
  };

  const ChartComponent = chartType === 'doughnut' ? Doughnut : Pie;

  return (
    <div className="w-full h-full">
      <ChartComponent data={chartData} options={options} />
    </div>
  );
}

export default CategoryDistributionChart;
