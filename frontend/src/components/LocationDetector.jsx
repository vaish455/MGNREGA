import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function LocationDetector({ onDistrictDetected, onSkip }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, language } = useLanguage();

  const handleDetectLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError(language === 'hi' ? 'आपका ब्राउज़र लोकेशन का समर्थन नहीं करता' : 'Your browser does not support geolocation');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          console.log('Detected coordinates:', { latitude, longitude });
          
          // Call backend API to detect district from coordinates
          const response = await fetch(`${API_BASE_URL}/location/detect-district`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });
          
          const data = await response.json();
          
          if (data.success && data.data && data.data.district) {
            console.log('District detected:', data.data.district);
            
            // Show success message if fuzzy match
            if (data.data.fuzzyMatch) {
              const districtNameTranslated = translateDistrictName(data.data.district.districtName, language);
              const stateNameTranslated = translateStateName(data.data.district.state.stateName, language);
              const msg = language === 'hi' 
                ? `✅ पता लगाया गया: ${districtNameTranslated}, ${stateNameTranslated} (अनुमानित)`
                : `✅ Detected: ${districtNameTranslated}, ${stateNameTranslated} (approximate match)`;
              setError(msg);
              setTimeout(() => {
                onDistrictDetected(data.data.district);
              }, 2000);
            } else {
              onDistrictDetected(data.data.district);
            }
          } else {
            // Could not detect district
            const baseMsg = data.error || (language === 'hi' ? 'जिला नहीं मिला' : 'District not found');
            const selectMsg = language === 'hi' ? 'कृपया मैन्युअल रूप से चुनें' : 'Please select manually';
            setError(`${baseMsg}\n\n${selectMsg}`);
            setLoading(false);
          }
        } catch (err) {
          console.error('Location detection error:', err);
          setError(language === 'hi' ? 'लोकेशन का पता लगाने में त्रुटि। कृपया मैन्युअल रूप से चुनें' : 'Error detecting location. Please select manually.');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(language === 'hi' ? 'लोकेशन एक्सेस अस्वीकृत। कृपया मैन्युअल रूप से चुनें' : 'Location access denied. Please select manually');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
        <div className="text-center">
          {/* Location Icon */}
          <div className="mb-4">
            <svg 
              className="w-16 h-16 mx-auto text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'hi' ? 'अपना जिला खोजें' : 'Find Your District'}
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {language === 'hi' 
              ? 'हम आपकी लोकेशन से आपका जिला अपने आप पता लगा सकते हैं'
              : 'We can automatically detect your district from your location'}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
            <button
              onClick={handleDetectLocation}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-base sm:text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <span className="inline-block mr-2">⏳</span>
                  {t('detectingLocation')}
                </>
              ) : (
                <>
                  <span className="inline-block mr-2">📍</span>
                  {t('detectLocation')}
                </>
              )}
            </button>
            
            <button
              onClick={onSkip}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg text-base sm:text-lg transition-colors shadow-lg"
            >
              {t('enterManually')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationDetector;
