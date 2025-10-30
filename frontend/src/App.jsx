import { useState, useEffect } from 'react';
import DistrictSelector from './components/DistrictSelector';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import LocationDetector from './components/LocationDetector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function AppContent() {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLocationDetector, setShowLocationDetector] = useState(true);

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setShowLocationDetector(false);
  };

  const handleLocationDetected = (district) => {
    setSelectedDistrict(district);
    setShowLocationDetector(false);
  };

  const handleChangeDistrict = () => {
    setSelectedDistrict(null);
    setShowLocationDetector(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        {!selectedDistrict && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('welcomeTitle')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('welcomeDescription')}
            </p>
          </div>
        )}

        {/* Location Detector - shown first time only */}
        {!selectedDistrict && showLocationDetector && (
          <LocationDetector 
            onDistrictDetected={handleLocationDetected}
            onSkip={() => setShowLocationDetector(false)}
          />
        )}

        {/* District Selector */}
        {!selectedDistrict && !showLocationDetector && (
          <DistrictSelector onSelect={handleDistrictSelect} />
        )}

        {/* Dashboard */}
        {selectedDistrict && (
          <Dashboard 
            district={selectedDistrict}
            onChangeDistrict={handleChangeDistrict}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            {t('dataSource')}
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
