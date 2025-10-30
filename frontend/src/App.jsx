import { useState, useEffect } from 'react';
import DistrictSelector from './components/DistrictSelector';
import Dashboard from './components/Dashboard';
import ComparisonPage from './components/ComparisonPage';
import AboutPage from './components/AboutPage';
import Header from './components/Header';
import LocationDetector from './components/LocationDetector';
import ChatBot from './components/ChatBot';
import WelcomePage from './components/WelcomePage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function AppContent() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'dashboard', 'comparison', 'about'
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const [showLocationDetector, setShowLocationDetector] = useState(false);

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setShowLocationDetector(false);
    setShowWelcomePage(false);
    setCurrentView('dashboard');
  };

  const handleLocationDetected = (district) => {
    setSelectedDistrict(district);
    setShowLocationDetector(false);
    setShowWelcomePage(false);
    setCurrentView('dashboard');
  };

  const handleChangeDistrict = () => {
    setSelectedDistrict(null);
    setShowLocationDetector(false);
    setShowWelcomePage(true);
    setCurrentView('home');
  };

  const handleBackToWelcome = () => {
    setShowLocationDetector(false);
    setShowWelcomePage(true);
  };

  const handleChatbotNavigation = (district) => {
    console.log('handleChatbotNavigation called with:', district);
    setSelectedDistrict(district);
    setShowLocationDetector(false);
    setCurrentView('dashboard');
    console.log('District set, should navigate to dashboard');
  };

  const handleNavigateToComparison = () => {
    setCurrentView('comparison');
  };

  const handleNavigateToAbout = () => {
    setCurrentView('about');
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedDistrict(null);
    setShowLocationDetector(false);
    setShowWelcomePage(true);
  };

  const handleBackFromComparison = () => {
    if (selectedDistrict) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleBackFromAbout = () => {
    if (selectedDistrict) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
      {currentView !== 'comparison' && currentView !== 'about' && (
        <Header 
          onNavigateToComparison={handleNavigateToComparison}
          onNavigateToAbout={handleNavigateToAbout}
          onNavigateHome={handleNavigateHome}
        />
      )}
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Home View */}
        {currentView === 'home' && (
          <>
            {/* Welcome Page - shown by default */}
            {showWelcomePage && (
              <WelcomePage 
                onShowLocationDetector={() => {
                  setShowWelcomePage(false);
                  setShowLocationDetector(true);
                }}
                onShowDistrictSelector={() => {
                  setShowWelcomePage(false);
                  setShowLocationDetector(false);
                }}
              />
            )}

            {/* Location Detector */}
            {!showWelcomePage && showLocationDetector && (
              <div className="mt-8 animate-slide-up">
                <LocationDetector 
                  onDistrictDetected={handleLocationDetected}
                  onSkip={() => setShowLocationDetector(false)}
                />
              </div>
            )}

            {/* District Selector */}
            {!showWelcomePage && !showLocationDetector && (
              <div className="animate-fade-in">
                <DistrictSelector 
                  onSelect={handleDistrictSelect}
                  onBack={handleBackToWelcome}
                />
              </div>
            )}
          </>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && selectedDistrict && (
          <Dashboard 
            district={selectedDistrict}
            onChangeDistrict={handleChangeDistrict}
            onNavigateToComparison={handleNavigateToComparison}
          />
        )}

        {/* Comparison View */}
        {currentView === 'comparison' && (
          <ComparisonPage onBack={handleBackFromComparison} />
        )}

        {/* About View */}
        {currentView === 'about' && (
          <AboutPage onBack={handleBackFromAbout} />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'comparison' && currentView !== 'about' && (
        <footer className="bg-white border-t border-gray-200 py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">
              {t('dataSource')}
            </p>
          </div>
        </footer>
      )}

      {/* ChatBot - visible on all pages except About */}
      {currentView !== 'about' && <ChatBot onNavigate={handleChatbotNavigation} />}
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
