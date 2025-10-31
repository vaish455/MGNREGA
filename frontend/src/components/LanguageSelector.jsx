import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelector() {
  const { language, toggleLanguage } = useLanguage();

  const handleToggle = () => {
    const newLanguage = language === 'en' ? 'hi' : 'en';
    console.log(`Switching language from ${language} to ${newLanguage}`);
    toggleLanguage(newLanguage);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center space-x-2 bg-white hover:bg-gray-100 border-2 border-orange-500 text-orange-600 font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
      aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
      type="button"
      title={`Switch to ${language === 'en' ? 'Hindi (हिन्दी)' : 'English'}`}
    >
      {/* Language Icon */}
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
        />
      </svg>
      
      {/* Current Language Display */}
      <span className="hidden md:inline font-semibold">
        {language === 'en' ? 'English' : 'हिन्दी'}
      </span>
      
      {/* Flag Icon */}
      <span className="text-xl">
        {language === 'en' ? '🇬🇧' : '🇮🇳'}
      </span>
      
      {/* Switch Arrow */}
      <svg 
        className="w-4 h-4 animate-pulse" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
        />
      </svg>
    </button>
  );
}

export default LanguageSelector;
