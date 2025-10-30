import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function DistrictSelector({ onSelect }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [error, setError] = useState(null);

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
      setError('कृपया बाद में पुनः प्रयास करें / Please try again later');
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
      setError('जिले लोड करने में त्रुटि / Error loading districts');
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
        <p className="mt-4 text-gray-600">Loading states...</p>
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
            पुनः प्रयास करें / Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Step 1: Select State */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            1. अपना राज्य चुनें
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            Select Your State
          </p>
          
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
                  <span className="text-gray-800">{state.stateName}</span>
                  {selectedState === state.stateCode && (
                    <span className="text-orange-600">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {state._count?.districts || 0} districts
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select District */}
        {selectedState && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              2. अपना जिला चुनें
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              Select Your District
            </p>

            {loadingDistricts ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="mt-2 text-gray-600">Loading districts...</p>
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
                        {district.districtName}
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
                इस राज्य के लिए कोई जिला नहीं मिला
                <br />
                No districts found for this state
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DistrictSelector;
