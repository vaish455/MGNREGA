import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const METRICS = [
  { key: 'avgDaysWorked', label: 'Average Days Worked', unit: 'days' },
  { key: 'avgWageRate', label: 'Average Wage Rate', unit: '₹' },
  { key: 'totalJobCards', label: 'Total Job Cards', unit: '' },
  { key: 'totalEmployment', label: 'Total Employment', unit: '' },
  { key: 'womenPercentage', label: 'Women Employment %', unit: '%' },
  { key: 'scPercentage', label: 'SC Employment %', unit: '%' },
  { key: 'stPercentage', label: 'ST Employment %', unit: '%' },
  { key: 'completedWorks', label: 'Completed Works', unit: '' },
  { key: 'ongoingWorks', label: 'Ongoing Works', unit: '' },
];

function ComparisonPage({ onBack }) {
  const { t, language } = useLanguage();
  const [comparisonType, setComparisonType] = useState('states'); // 'states' or 'districts'
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(['avgDaysWorked', 'avgWageRate', 'totalEmployment']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (comparisonType === 'districts') {
      fetchAllDistricts();
    }
  }, [comparisonType]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      fetchComparisonData();
    } else {
      setComparisonData([]);
    }
  }, [selectedItems, comparisonType]);

  // Keyboard shortcut: ESC to clear search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/states`);
      const result = await response.json();
      if (result.success) {
        setStates(result.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchAllDistricts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/districts`);
      const result = await response.json();
      if (result.success) {
        setDistricts(result.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const itemIds = selectedItems.map(item => 
        comparisonType === 'states' ? item.stateCode : item.districtCode
      ).join(',');
      
      const response = await fetch(
        `${API_BASE_URL}/compare/${comparisonType}?ids=${itemIds}`
      );
      const result = await response.json();
      
      if (result.success) {
        setComparisonData(result.data);
      } else {
        setError(result.error || 'Failed to fetch comparison data');
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError('Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setComparisonType(type);
    setSelectedItems([]);
    setComparisonData([]);
    setSearchQuery(''); // Reset search when changing type
  };

  const getFilteredItems = () => {
    const items = comparisonType === 'states' ? states : districts;
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const name = comparisonType === 'states' ? item.stateName : item.districtName;
      const translatedName = comparisonType === 'states' 
        ? translateStateName(name, language)
        : translateDistrictName(name, language);
      
      return name.toLowerCase().includes(query) || 
             translatedName.toLowerCase().includes(query) ||
             (comparisonType === 'states' ? item.stateCode : item.districtCode).toLowerCase().includes(query);
    });
  };

  const handleItemToggle = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => 
        comparisonType === 'states' 
          ? i.stateCode === item.stateCode 
          : i.districtCode === item.districtCode
      );
      
      if (isSelected) {
        return prev.filter(i => 
          comparisonType === 'states' 
            ? i.stateCode !== item.stateCode 
            : i.districtCode !== item.districtCode
        );
      } else {
        if (prev.length >= 6) {
          alert('You can compare up to 6 items at a time');
          return prev;
        }
        return [...prev, item];
      }
    });
  };

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricKey)) {
        if (prev.length === 1) {
          alert('At least one metric must be selected');
          return prev;
        }
        return prev.filter(m => m !== metricKey);
      } else {
        return [...prev, metricKey];
      }
    });
  };

  const formatValue = (value, metric) => {
    if (typeof value !== 'number') return 'N/A';
    
    if (metric.unit === '₹') {
      return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    } else if (metric.unit === '%') {
      return `${value.toFixed(2)}%`;
    } else if (metric.unit === 'days') {
      return `${value.toFixed(2)} days`;
    }
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    if (comparisonData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          Select items to compare
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {selectedMetrics.map((metricKey) => {
          const metric = METRICS.find(m => m.key === metricKey);
          const maxValue = Math.max(...comparisonData.map(item => item[metricKey] || 0));
          
          return (
            <div key={metricKey} className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {metric.label}
              </h3>
              <div className="space-y-4">
                {comparisonData.map((item, index) => {
                  const name = comparisonType === 'states' 
                    ? (language === 'hi' ? translateStateName(item.name, 'hi') : item.name)
                    : (language === 'hi' ? translateDistrictName(item.name, 'hi') : item.name);
                  const value = item[metricKey] || 0;
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const color = COLORS[index % COLORS.length];
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {name}
                        </span>
                        <span className="text-lg font-bold" style={{ color }}>
                          {formatValue(value, metric)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 flex items-center px-2"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        >
                          {percentage > 10 && (
                            <span className="text-white text-xs font-semibold">
                              {percentage.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDataTable = () => {
    if (comparisonData.length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-orange-100 to-green-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b border-gray-200">
                Metric
              </th>
              {comparisonData.map((item, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b border-gray-200">
                  {comparisonType === 'states' 
                    ? (language === 'hi' ? translateStateName(item.name, 'hi') : item.name)
                    : (language === 'hi' ? translateDistrictName(item.name, 'hi') : item.name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.filter(m => selectedMetrics.includes(m.key)).map((metric, idx) => (
              <tr key={metric.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                  {metric.label}
                </td>
                {comparisonData.map((item, index) => (
                  <td key={index} className="px-4 py-3 text-sm text-gray-700 border-b">
                    {metric.unit === '₹' && '₹'}
                    {typeof item[metric.key] === 'number' 
                      ? item[metric.key].toLocaleString('en-IN', { maximumFractionDigits: 2 })
                      : 'N/A'}
                    {metric.unit === '%' && '%'}
                    {metric.unit === 'days' && ' days'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <button
            onClick={onBack}
            className="mb-4 flex items-center bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg text-gray-700 hover:text-orange-600 transition-all duration-200 border border-gray-200 hover:border-orange-300 font-medium transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Comparison Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Compare MGNREGA data across multiple states or districts
          </p>
        </div>

        {/* Comparison Type Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-slide-down">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Comparison Type</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleTypeChange('states')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                comparisonType === 'states'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Compare States
            </button>
            <button
              onClick={() => handleTypeChange('districts')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                comparisonType === 'districts'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Compare Districts
            </button>
          </div>
        </div>

        {/* Item Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Select {comparisonType === 'states' ? 'States' : 'Districts'} 
              <span className="text-orange-600 ml-2 font-bold">({selectedItems.length}/6)</span>
            </h2>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-500"
              >
                Clear All
              </button>
            )}
          </div>
          
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${comparisonType === 'states' ? 'states' : 'districts'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {getFilteredItems().length} of {comparisonType === 'states' ? states.length : districts.length} {comparisonType}
              </p>
            )}
          </div>
          
          {getFilteredItems().length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {getFilteredItems().map((item) => {
                const isSelected = selectedItems.some(i => 
                  comparisonType === 'states' 
                    ? i.stateCode === item.stateCode 
                    : i.districtCode === item.districtCode
                );
                const name = comparisonType === 'states'
                  ? (language === 'hi' ? translateStateName(item.stateName, 'hi') : item.stateName)
                  : (language === 'hi' ? translateDistrictName(item.districtName, 'hi') : item.districtName);
                
                return (
                  <button
                    key={comparisonType === 'states' ? item.stateCode : item.districtCode}
                    onClick={() => handleItemToggle(item)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No {comparisonType} found</p>
              <p className="text-sm mt-1">Try adjusting your search query</p>
            </div>
          )}
        </div>

        {/* Metrics Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Metrics to Compare</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {METRICS.map((metric) => (
              <button
                key={metric.key}
                onClick={() => handleMetricToggle(metric.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                  selectedMetrics.includes(metric.key)
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-400'
                }`}
                style={selectedMetrics.includes(metric.key) ? { backgroundColor: '#F95400' } : {}}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-scale-in">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comparison Chart</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
              {error}
            </div>
          )}
          {renderChart()}
        </div>

        {/* Data Table */}
        {comparisonData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed Comparison</h2>
            {renderDataTable()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonPage;
