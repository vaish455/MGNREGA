import React, { useState, useEffect } from 'react';
import DataCard from './DataCard';
import ComparisonChart from './ComparisonChart';
import ExplainerBox from './ExplainerBox';
import TrendChart from './TrendChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import BarComparisonChart from './BarComparisonChart';
import MetricsOverviewChart from './MetricsOverviewChart';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Dashboard({ district, onChangeDistrict, onNavigateToComparison }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [stateAverage, setStateAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chart view toggles
  const [selectedTrendMetric, setSelectedTrendMetric] = useState('wage');
  const [showWomenChart, setShowWomenChart] = useState(false);
  const [showSCSTChart, setShowSCSTChart] = useState(false);
  const [showWorksChart, setShowWorksChart] = useState(false);

  useEffect(() => {
    fetchDistrictData();
  }, [district]);

  const fetchDistrictData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch latest data for the district
      const latestResponse = await fetch(
        `${API_BASE_URL}/mgnrega-data/latest/${district.districtCode}`
      );
      const latestData = await latestResponse.json();

      if (!latestData.success) {
        throw new Error('No data available for this district');
      }

      setData(latestData.data);

      // Fetch comparison data (historical)
      const comparisonResponse = await fetch(
        `${API_BASE_URL}/mgnrega-data/comparison/${district.districtCode}?finYear=${latestData.data.finYear}`
      );
      const comparisonData = await comparisonResponse.json();
      if (comparisonData.success) {
        setComparison(comparisonData.data);
      }

      // Fetch state average for comparison
      const stateResponse = await fetch(
        `${API_BASE_URL}/mgnrega-data/state-average/${district.stateCode}?finYear=${latestData.data.finYear}`
      );
      const stateData = await stateResponse.json();
      if (stateData.success) {
        setStateAverage(stateData.data);
      }

    } catch (err) {
      console.error('Error fetching district data:', err);
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-xl text-gray-600 animate-pulse-subtle">
          {t('loadingData')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold text-lg">{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={fetchDistrictData}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              {t('tryAgain')}
            </button>
            <button
              onClick={onChangeDistrict}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg"
            >
              {t('changeDistrict')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-semibold text-lg">
            {t('noDataAvailable')}
          </p>
          <button
            onClick={onChangeDistrict}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            {t('chooseAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onChangeDistrict}
        className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-blue-600 transition-all border border-gray-200 hover:border-blue-300 animate-slide-in-left"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">{language === 'hi' ? 'जिला बदलें' : 'Change District'}</span>
      </button>

      {/* District Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-xl shadow-lg p-6 md:p-8 text-white animate-slide-down">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {translateDistrictName(district.districtName, language)}
            </h2>
            <p className="text-xl opacity-90">
              {translateStateName(district.state?.stateName, language)}
            </p>
            <p className="text-sm opacity-75 mt-2">
              {t('financialYear')}: {data.finYear} | {t('month')}: {data.month}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={onNavigateToComparison}
              className="text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
              style={{ backgroundColor: '#FF6900' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e05800'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6900'}
            >
              🔍 Compare
            </button>
            <button
              onClick={onChangeDistrict}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {t('changeDistrict')}
            </button>
          </div>
        </div>
      </div>

      {/* What is MGNREGA Explainer */}
      <ExplainerBox />

      {/* Key Metrics */}
      <div className="animate-slide-up">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {t('keyStatistics')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DataCard
            titleHi={t('householdsWorked')}
            titleEn={t('householdsWorked')}
            value={data.totalHouseholdsWorked}
            color="blue"
            explanation={t('householdsWorkedDesc')}
          />
          
          <DataCard
            titleHi={t('individualsWorked')}
            titleEn={t('individualsWorked')}
            value={data.totalIndividualsWorked}
            color="green"
            explanation={t('individualsWorkedDesc')}
          />
          
          <DataCard
            titleHi={t('avgWagePerDay')}
            titleEn={t('avgWagePerDay')}
            value={data.averageWageRatePerDayPerPerson}
            prefix="₹"
            color="yellow"
            explanation={t('avgWagePerDayDesc')}
          />
          
          <DataCard
            titleHi={t('avgEmploymentDays')}
            titleEn={t('avgEmploymentDays')}
            value={data.averageDaysOfEmploymentProvidedPerHousehold}
            suffix={` ${t('days')}`}
            color="purple"
            explanation={t('avgEmploymentDaysDesc')}
            highlight={parseInt(data.averageDaysOfEmploymentProvidedPerHousehold) >= 100}
          />
          
          <DataCard
            titleHi={t('families100Days')}
            titleEn={t('families100Days')}
            value={data.totalNoOfHhsCompleted100DaysOfWageEmployment}
            color="orange"
            explanation={t('families100DaysDesc')}
          />
          
          <DataCard
            titleHi={t('totalExpenditure')}
            titleEn={t('totalExpenditure')}
            value={data.totalExp}
            prefix="₹"
            suffix=" Cr"
            color="red"
            explanation={t('totalExpenditureDesc')}
          />
        </div>
      </div>

      {/* Metrics Overview Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            {language === 'hi' ? '📊 मेट्रिक्स अवलोकन' : '📊 Metrics Overview'}
          </h3>
        </div>
        <div className="h-80">
          <MetricsOverviewChart data={data} />
        </div>
      </div>

      {/* Historical Trends */}
      {comparison && comparison.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? '📈 ऐतिहासिक रुझान' : '📈 Historical Trends'}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTrendMetric('wage')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTrendMetric === 'wage'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {language === 'hi' ? '💰 मजदूरी' : '💰 Wages'}
              </button>
              <button
                onClick={() => setSelectedTrendMetric('days')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTrendMetric === 'days'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {language === 'hi' ? '📅 रोजगार दिवस' : '📅 Employment Days'}
              </button>
              <button
                onClick={() => setSelectedTrendMetric('households')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTrendMetric === 'households'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {language === 'hi' ? '🏠 परिवार' : '🏠 Households'}
              </button>
              <button
                onClick={() => setSelectedTrendMetric('expenditure')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTrendMetric === 'expenditure'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {language === 'hi' ? '💵 व्यय' : '💵 Expenditure'}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 h-80">
            <TrendChart comparisonData={comparison} metric={selectedTrendMetric} />
          </div>
        </div>
      )}

      {/* Women Participation */}
      <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            {t('womenParticipation')}
          </h3>
          <button
            onClick={() => setShowWomenChart(!showWomenChart)}
            className="ml-4 bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {language === 'hi' 
              ? (showWomenChart ? 'ग्राफ छुपाएं' : 'ग्राफ देखें')
              : (showWomenChart ? 'Hide Graph' : 'View Graph')
            }
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataCard
            titleHi={t('womenPersonDays')}
            titleEn={t('womenPersonDays')}
            value={data.womenPersondays}
            color="pink"
            explanation={t('womenPersonDaysDesc')}
          />
          <div className="bg-white rounded-lg p-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {data.womenPersondays && data.persondaysOfCentralLiabilitySoFar ? (
                <>
                  <span className="font-bold text-2xl text-pink-600">
                    {((parseInt(data.womenPersondays) / parseInt(data.persondaysOfCentralLiabilitySoFar)) * 100).toFixed(1)}%
                  </span>
                  <br />
                  <span className="text-gray-600">
                    {t('womenParticipationRate')}
                  </span>
                </>
              ) : t('dataNotAvailable')}
            </p>
          </div>
          {showWomenChart && (
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3 text-center">
                {language === 'hi' ? 'लिंग वितरण' : 'Gender Distribution'}
              </h4>
              <div className="h-64">
                <CategoryDistributionChart data={data} type="women" chartType="doughnut" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SC/ST Participation */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            {t('scstParticipation')}
          </h3>
          <button
            onClick={() => setShowSCSTChart(!showSCSTChart)}
            className="ml-4 bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {language === 'hi' 
              ? (showSCSTChart ? 'ग्राफ छुपाएं' : 'ग्राफ देखें')
              : (showSCSTChart ? 'Hide Graph' : 'View Graph')
            }
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataCard
            titleHi={t('scWorkers')}
            titleEn={t('scWorkers')}
            value={data.scWorkersAgainstActiveWorkers}
            color="blue"
            explanation={t('scWorkersDesc')}
          />
          <DataCard
            titleHi={t('stWorkers')}
            titleEn={t('stWorkers')}
            value={data.stWorkersAgainstActiveWorkers}
            color="indigo"
            explanation={t('stWorkersDesc')}
          />
          {showSCSTChart && (
            <div className="md:col-span-2 bg-white rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3 text-center">
                {language === 'hi' ? 'SC/ST कामगार वितरण' : 'SC/ST Worker Distribution'}
              </h4>
              <div className="h-64">
                <CategoryDistributionChart data={data} type="scst" chartType="pie" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Works Progress */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            {t('worksProgress')}
          </h3>
          <button
            onClick={() => setShowWorksChart(!showWorksChart)}
            className="ml-4 bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {language === 'hi' 
              ? (showWorksChart ? 'ग्राफ छुपाएं' : 'ग्राफ देखें')
              : (showWorksChart ? 'Hide Graph' : 'View Graph')
            }
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataCard
            titleHi={t('completedWorks')}
            titleEn={t('completedWorks')}
            value={data.numberOfCompletedWorks}
            color="green"
            explanation={t('completedWorksDesc')}
          />
          <DataCard
            titleHi={t('ongoingWorks')}
            titleEn={t('ongoingWorks')}
            value={data.numberOfOngoingWorks}
            color="yellow"
            explanation={t('ongoingWorksDesc')}
          />
          <DataCard
            titleHi={t('totalWorksStarted')}
            titleEn={t('totalWorksStarted')}
            value={data.totalNoOfWorksTakenup}
            color="blue"
            explanation={t('totalWorksStartedDesc')}
          />
        </div>
        {showWorksChart && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3 text-center">
              {language === 'hi' ? 'कार्य स्थिति वितरण' : 'Work Status Distribution'}
            </h4>
            <div className="h-64">
              <CategoryDistributionChart data={data} type="works" chartType="doughnut" />
            </div>
          </div>
        )}
      </div>

      {/* Comparison with State Average */}
      {stateAverage && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {t('comparisonWithState')}
          </h3>
          
          {/* Text-based comparison */}
          <div className="mb-6">
            <ComparisonChart 
              districtData={data}
              stateAverage={stateAverage}
              districtName={district.districtName}
              stateName={district.state?.stateName}
            />
          </div>
          
          {/* Chart-based comparison */}
          <div className="bg-white rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
              {language === 'hi' ? '📊 राज्य औसत के साथ तुलना' : '📊 Comparison with State Average'}
            </h4>
            <div className="h-80">
              <BarComparisonChart 
                districtData={data}
                stateAverage={stateAverage}
                districtName={district.districtName}
                stateName={district.state?.stateName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Cards & Active Workers */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {t('jobCardsActiveWorkers')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataCard
            titleHi={t('totalJobCardsIssued')}
            titleEn={t('totalJobCardsIssued')}
            value={data.totalNoOfJobCardsIssued}
            color="teal"
            explanation={t('totalJobCardsIssuedDesc')}
          />
          <DataCard
            titleHi={t('activeJobCards')}
            titleEn={t('activeJobCards')}
            value={data.totalNoOfActiveJobCards}
            color="green"
            explanation={t('activeJobCardsDesc')}
          />
          <DataCard
            titleHi={t('activeWorkers')}
            titleEn={t('activeWorkers')}
            value={data.totalNoOfActiveWorkers}
            color="blue"
            explanation={t('activeWorkersDesc')}
          />
        </div>
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-3 text-center">
            {language === 'hi' ? 'जॉब कार्ड स्थिति' : 'Job Card Status'}
          </h4>
          <div className="h-64">
            <CategoryDistributionChart data={data} type="jobcards" chartType="pie" />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
        <h4 className="text-xl font-bold text-green-800 mb-3">
          {t('whyImportant')}
        </h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>{t('importance1')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>{t('importance2')}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>{t('importance3')}</span>
          </li>
        </ul>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        <p>
          {t('lastUpdated')}: {new Date(data.updatedAt).toLocaleDateString('en-IN')}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
