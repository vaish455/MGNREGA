import React from 'react';

const colorClasses = {
  blue: 'bg-blue-100 border-blue-300 text-blue-800',
  green: 'bg-green-100 border-green-300 text-green-800',
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  red: 'bg-red-100 border-red-300 text-red-800',
  purple: 'bg-purple-100 border-purple-300 text-purple-800',
  orange: 'bg-orange-100 border-orange-300 text-orange-800',
  pink: 'bg-pink-100 border-pink-300 text-pink-800',
  indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  teal: 'bg-teal-100 border-teal-300 text-teal-800',
};

function DataCard({ titleHi, titleEn, value, prefix = '', suffix = '', icon, color = 'blue', explanation, highlight = false }) {
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    
    if (isNaN(numValue)) return 'N/A';
    
    // For large numbers, format with Indian numbering system
    if (numValue >= 10000000) {
      return (numValue / 10000000).toFixed(2) + ' Cr';
    } else if (numValue >= 100000) {
      return (numValue / 100000).toFixed(2) + ' L';
    } else if (numValue >= 1000) {
      return numValue.toLocaleString('en-IN');
    }
    
    return numValue.toFixed(2);
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all hover:shadow-lg ${colorClasses[color]} ${highlight ? 'ring-4 ring-green-400 ring-opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-lg leading-tight mb-1">
            {titleHi}
          </h4>
          <p className="text-sm opacity-80">
            {titleEn}
          </p>
        </div>
        {icon && (
          <span className="text-3xl ml-2">{icon}</span>
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-3xl md:text-4xl font-bold">
          {prefix}{formatNumber(value)}{suffix}
        </p>
      </div>
      
      {explanation && (
        <div className="text-sm opacity-75 border-t pt-3 mt-3">
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}
      
      {highlight && (
        <div className="mt-2 text-xs font-semibold text-green-700 bg-green-50 rounded px-2 py-1 inline-block">
          🎉 लक्ष्य हासिल! / Target Achieved!
        </div>
      )}
    </div>
  );
}

export default DataCard;
