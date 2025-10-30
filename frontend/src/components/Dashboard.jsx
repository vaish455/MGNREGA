import React, { useState, useEffect } from 'react';
import DataCard from './DataCard';
import ComparisonChart from './ComparisonChart';
import ExplainerBox from './ExplainerBox';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStateName, translateDistrictName } from '../utils/stateTranslations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Dashboard({ district, onChangeDistrict }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [stateAverage, setStateAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-xl text-gray-600">
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
    <div className="space-y-8">
      {/* District Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-xl shadow-lg p-6 md:p-8 text-white">
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
          <button
            onClick={onChangeDistrict}
            className="mt-4 md:mt-0 bg-white text-orange-600 hover:bg-orange-50 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            {t('changeDistrict')}
          </button>
        </div>
      </div>

      {/* What is MGNREGA Explainer */}
      <ExplainerBox />

      {/* Key Metrics */}
      <div>
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

      {/* Women Participation */}
      <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {t('womenParticipation')}
        </h3>
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
        </div>
      </div>

      {/* SC/ST Participation */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {t('scstParticipation')}
        </h3>
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
        </div>
      </div>

      {/* Works Progress */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {t('worksProgress')}
        </h3>
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
      </div>

      {/* Comparison with State Average */}
      {stateAverage && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {t('comparisonWithState')}
          </h3>
          <ComparisonChart 
            districtData={data}
            stateAverage={stateAverage}
            districtName={district.districtName}
            stateName={district.state?.stateName}
          />
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
