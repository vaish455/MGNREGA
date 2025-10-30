import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

function Header({ onNavigateToComparison, onNavigateToAbout, onNavigateHome }) {
  const { t, language } = useLanguage();
  
  return (
    <header className="bg-white shadow-md border-b-4 border-orange-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Indian Flag Colors - clickable to go home */}
            <button 
              onClick={onNavigateHome}
              className="flex flex-col hover:opacity-80 transition-opacity"
              aria-label="Go to home"
            >
              <div className="w-16 h-2 bg-orange-500"></div>
              <div className="w-16 h-2 bg-white border border-gray-300"></div>
              <div className="w-16 h-2 bg-green-600"></div>
            </button>
            <div>
              <button 
                onClick={onNavigateHome}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {t('headerTitle')}
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  {t('headerSubtitle')}
                </p>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Navigation Buttons */}
            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={onNavigateToComparison}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {language === 'hi' ? 'तुलना करें' : 'Compare'}
              </button>
              <button
                onClick={onNavigateToAbout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {language === 'hi' ? 'हमारे बारे में' : 'About'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={onNavigateToComparison}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={language === 'hi' ? 'तुलना करें' : 'Compare'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button
                onClick={onNavigateToAbout}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'hi' ? 'हमारे बारे में' : 'About'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
