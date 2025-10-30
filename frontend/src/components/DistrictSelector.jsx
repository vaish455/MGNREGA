import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function DistrictSelector({ onSelect, onBack }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [error, setError] = useState(null);
  const { t, language } = useLanguage();

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    }
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/states`);
      const data = await response.json();
      
      if (data.success) {
        setStates(data.data);
      } else {
        setError('Failed to load states');
      }
    } catch (err) {
      console.error('Error fetching states:', err);
      setError(language === 'hi' ? 'कृपया बाद में पुनः प्रयास करें' : 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateCode) => {
    try {
      setLoadingDistricts(true);
      const response = await fetch(`${API_BASE_URL}/districts?stateCode=${stateCode}`);
      const data = await response.json();
      
      if (data.success) {
        setDistricts(data.data);
      } else {
        setError('Failed to load districts');
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError(language === 'hi' ? 'जिले लोड करने में त्रुटि' : 'Error loading districts');
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictClick = (district) => {
    onSelect(district);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-600">{t('loadingData')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">{error}</p>
          <button
            onClick={fetchStates}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back to Welcome Button - Show at top level */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-blue-600 transition-all border border-gray-200 hover:border-blue-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">{language === 'hi' ? 'वापस स्वागत पृष्ठ पर जाएं' : 'Back to Welcome'}</span>
        </button>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Back Button - Show when state is selected */}
        {selectedState && (
          <button
            onClick={() => {
              setSelectedState('');
              setDistricts([]);
            }}
            className="mb-4 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-blue-600 transition-all border border-gray-200 hover:border-blue-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">{language === 'hi' ? 'वापस राज्य चयन पर जाएं' : 'Back to State Selection'}</span>
          </button>
        )}

        {/* Step 1: Select State */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            1. {t('selectState')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {states.map((state) => (
              <button
                key={state.id}
                onClick={() => setSelectedState(state.stateCode)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedState === state.stateCode
                    ? 'border-orange-500 bg-orange-50 font-bold'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{translateStateName(state.stateName, language)}</span>
                  {selectedState === state.stateCode && (
                    <span className="text-orange-600 font-bold">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {state._count?.districts || 0} {language === 'hi' ? 'जिले' : 'districts'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select District */}
        {selectedState && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              2. {t('selectDistrict')}
            </h3>

            {loadingDistricts ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="mt-2 text-gray-600">{t('loadingData')}</p>
              </div>
            ) : districts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => handleDistrictClick(district)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-medium group-hover:font-bold">
                        {translateDistrictName(district.districtName, language)}
                      </span>
                      <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {language === 'hi' ? 'इस राज्य के लिए कोई जिला नहीं मिला' : 'No districts found for this state'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DistrictSelector;
