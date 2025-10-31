import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function WelcomePage({ onShowLocationDetector, onShowDistrictSelector, onDistrictDetected }) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            
            // Navigate directly to district data
            if (onDistrictDetected) {
              onDistrictDetected(data.data.district);
            }
          } else {
            // Could not detect district
            const baseMsg = data.error || (language === 'hi' ? 'जिला नहीं मिला' : 'District not found');
            const selectMsg = language === 'hi' ? 'कृपया मैन्युअल रूप से चुनें' : 'Please select manually';
            setError(`${baseMsg}. ${selectMsg}`);
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

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleKey: 'featureTransparency',
      descKey: 'featureTransparencyDesc'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      titleKey: 'featureRealtime',
      descKey: 'featureRealtimeDesc'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      titleKey: 'featureCommunity',
      descKey: 'featureCommunityDesc'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      titleKey: 'featureEducation',
      descKey: 'featureEducationDesc'
    }
  ];

  const stats = [
    { numberKey: 'stat100Days', labelKey: 'stat100DaysLabel' },
    { numberKey: 'statCroresPaid', labelKey: 'statCroresPaidLabel' },
    { numberKey: 'statActiveJobCards', labelKey: 'statActiveJobCardsLabel' },
    { numberKey: 'statWomenBeneficiaries', labelKey: 'statWomenBeneficiariesLabel' }
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8 animate-slide-down">
        <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full text-orange-800 font-semibold animate-pulse-subtle">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span>{t('heroTag')}</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
          {t('welcomeTitle')}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('welcomeDescription')}
        </p>

        {error && (
          <div className="max-w-md mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={handleDetectLocation}
            disabled={loading}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('detectingLocation')}
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('detectLocation')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
          
          <button
            onClick={onShowDistrictSelector}
            className="group bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {t('selectDistrict')}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-orange-500 to-green-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white animate-scale-in">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t('impactTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-2 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 animate-stagger"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold">
                {t(stat.numberKey)}
              </div>
              <div className="text-sm md:text-base opacity-90">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t('featuresTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl p-6 space-y-4 border border-gray-100 hover:border-orange-300 transform hover:-translate-y-2 transition-all duration-300 animate-stagger"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-green-50 to-orange-50 rounded-2xl shadow-lg p-8 md:p-12 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((step) => (
            <div 
              key={step}
              className="relative text-center space-y-4 animate-stagger"
              style={{ animationDelay: `${step * 200}ms` }}
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg animate-pulse-subtle">
                  {step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t(`step${step}Title`)}
              </h3>
              <p className="text-gray-600">
                {t(`step${step}Desc`)}
              </p>
              {step < 3 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <svg className="text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Rights Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-6 border-l-8 border-orange-500 animate-slide-in-left">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t('yourRights')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((right) => (
            <div 
              key={right}
              className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 animate-stagger"
              style={{ animationDelay: `${right * 100}ms` }}
            >
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 font-medium">
                {t(`right${right}`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default WelcomePage;
