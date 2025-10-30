import React, { useState } from 'react';

function LocationDetector({ onDistrictDetected, onSkip }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDetectLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('आपका ब्राउज़र लोकेशन का समर्थन नहीं करता / Your browser does not support geolocation');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // For now, we'll skip the actual API call as it requires geocoding service
          // In production, call your backend API to detect district from coordinates
          setError('स्वचालित पता लगाना शीघ्र आ रहा है। कृपया मैन्युअल रूप से चुनें / Auto-detection coming soon. Please select manually');
          setLoading(false);
          
          // TODO: Implement actual API call
          // const response = await fetch(`${API_BASE_URL}/location/detect-district`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ latitude, longitude }),
          // });
          // const data = await response.json();
          // onDistrictDetected(data.district);
        } catch (err) {
          setError('लोकेशन का पता लगाने में त्रुटि / Error detecting location');
          setLoading(false);
        }
      },
      (err) => {
        setError('लोकेशन एक्सेस अस्वीकृत। कृपया मैन्युअल रूप से चुनें / Location access denied. Please select manually');
        setLoading(false);
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
            अपना जिला खोजें
          </h3>
          <p className="text-xl text-gray-700 mb-6">
            Find Your District
          </p>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            हम आपकी लोकेशन से आपका जिला अपने आप पता लगा सकते हैं
            <br />
            <span className="text-sm text-gray-500">
              We can automatically detect your district from your location
            </span>
          </p>

          {error && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDetectLocation}
              disabled={loading}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <span className="inline-block mr-2">⏳</span>
                  पता लगा रहे हैं / Detecting...
                </>
              ) : (
                <>
                  <span className="inline-block mr-2">📍</span>
                  मेरी लोकेशन का उपयोग करें / Use My Location
                </>
              )}
            </button>
            
            <button
              onClick={onSkip}
              className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              खुद चुनें / Choose Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationDetector;
