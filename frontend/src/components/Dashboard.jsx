import React, { useState, useEffect } from 'react';
import DataCard from './DataCard';
import ComparisonChart from './ComparisonChart';
import ExplainerBox from './ExplainerBox';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Dashboard({ district, onChangeDistrict }) {
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
      setError('डेटा लोड करने में त्रुटि / Error loading data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-xl text-gray-600">
          डेटा लोड हो रहा है... / Loading data...
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
              पुनः प्रयास करें / Try Again
            </button>
            <button
              onClick={onChangeDistrict}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg"
            >
              जिला बदलें / Change District
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
            इस जिले के लिए कोई डेटा उपलब्ध नहीं है
            <br />
            <span className="text-sm">No data available for this district</span>
          </p>
          <button
            onClick={onChangeDistrict}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            दूसरा जिला चुनें / Choose Another District
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
              {district.districtName}
            </h2>
            <p className="text-xl opacity-90">
              {district.state?.stateName}
            </p>
            <p className="text-sm opacity-75 mt-2">
              वित्तीय वर्ष / Financial Year: {data.finYear} | महीना / Month: {data.month}
            </p>
          </div>
          <button
            onClick={onChangeDistrict}
            className="mt-4 md:mt-0 bg-white text-orange-600 hover:bg-orange-50 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            जिला बदलें / Change District
          </button>
        </div>
      </div>

      {/* What is MGNREGA Explainer */}
      <ExplainerBox />

      {/* Key Metrics */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          मुख्य आंकड़े / Key Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DataCard
            titleHi="परिवार जिन्हें काम मिला"
            titleEn="Households Who Got Work"
            value={data.totalHouseholdsWorked}
            icon="👨‍👩‍👧‍👦"
            color="blue"
            explanation="कितने परिवारों को मनरेगा के तहत काम मिला / Number of families who received work under MGNREGA"
          />
          
          <DataCard
            titleHi="कुल लोग जिन्होंने काम किया"
            titleEn="Total People Who Worked"
            value={data.totalIndividualsWorked}
            icon="👷"
            color="green"
            explanation="कितने लोगों ने इस महीने काम किया / Number of individuals who worked this month"
          />
          
          <DataCard
            titleHi="औसत वेतन प्रति दिन"
            titleEn="Average Wage Per Day"
            value={data.averageWageRatePerDayPerPerson}
            prefix="₹"
            icon="💰"
            color="yellow"
            explanation="एक दिन के काम के लिए औसत वेतन / Average daily wage for one day of work"
          />
          
          <DataCard
            titleHi="औसत रोजगार के दिन"
            titleEn="Average Days of Employment"
            value={data.averageDaysOfEmploymentProvidedPerHousehold}
            suffix=" days"
            icon="📅"
            color="purple"
            explanation="प्रति परिवार औसत काम के दिन / Average working days provided per family"
            highlight={parseInt(data.averageDaysOfEmploymentProvidedPerHousehold) >= 100}
          />
          
          <DataCard
            titleHi="100 दिन पूरे करने वाले परिवार"
            titleEn="Families Completing 100 Days"
            value={data.totalNoOfHhsCompleted100DaysOfWageEmployment}
            icon="🎯"
            color="orange"
            explanation="जिन परिवारों ने 100 दिन का रोजगार पूरा किया / Families who completed 100 days of employment"
          />
          
          <DataCard
            titleHi="कुल खर्च"
            titleEn="Total Expenditure"
            value={data.totalExp}
            prefix="₹"
            suffix=" Cr"
            icon="💵"
            color="red"
            explanation="इस महीने कुल खर्च / Total money spent this month"
          />
        </div>
      </div>

      {/* Women Participation */}
      <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          👩 महिला भागीदारी / Women Participation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataCard
            titleHi="महिलाओं द्वारा काम के दिन"
            titleEn="Person-days by Women"
            value={data.womenPersondays}
            icon="👩‍🌾"
            color="pink"
            explanation="महिलाओं द्वारा कितने दिन काम किया गया / Total working days by women"
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
                    महिलाओं की भागीदारी / Women's participation
                  </span>
                </>
              ) : 'Data not available'}
            </p>
          </div>
        </div>
      </div>

      {/* SC/ST Participation */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🤝 SC/ST भागीदारी / SC/ST Participation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataCard
            titleHi="SC श्रमिक"
            titleEn="SC Workers"
            value={data.scWorkersAgainstActiveWorkers}
            icon="👥"
            color="blue"
            explanation="अनुसूचित जाति के कितने श्रमिक / Number of Scheduled Caste workers"
          />
          <DataCard
            titleHi="ST श्रमिक"
            titleEn="ST Workers"
            value={data.stWorkersAgainstActiveWorkers}
            icon="👥"
            color="indigo"
            explanation="अनुसूचित जनजाति के कितने श्रमिक / Number of Scheduled Tribe workers"
          />
        </div>
      </div>

      {/* Works Progress */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🏗️ कार्य प्रगति / Works Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataCard
            titleHi="पूर्ण कार्य"
            titleEn="Completed Works"
            value={data.numberOfCompletedWorks}
            icon="✅"
            color="green"
            explanation="कितने काम पूरे हो गए / Number of works completed"
          />
          <DataCard
            titleHi="चालू कार्य"
            titleEn="Ongoing Works"
            value={data.numberOfOngoingWorks}
            icon="🚧"
            color="yellow"
            explanation="कितने काम चल रहे हैं / Number of works in progress"
          />
          <DataCard
            titleHi="कुल कार्य शुरू किए गए"
            titleEn="Total Works Started"
            value={data.totalNoOfWorksTakenup}
            icon="🏁"
            color="blue"
            explanation="कुल कितने काम शुरू किए गए / Total number of works initiated"
          />
        </div>
      </div>

      {/* Comparison with State Average */}
      {stateAverage && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            📊 राज्य से तुलना / Comparison with State
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
          📋 जॉब कार्ड और सक्रिय कार्यकर्ता / Job Cards & Active Workers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DataCard
            titleHi="कुल जॉब कार्ड"
            titleEn="Total Job Cards Issued"
            value={data.totalNoOfJobCardsIssued}
            icon="🎫"
            color="teal"
            explanation="कितने जॉब कार्ड जारी किए गए / Total job cards issued"
          />
          <DataCard
            titleHi="सक्रिय जॉब कार्ड"
            titleEn="Active Job Cards"
            value={data.totalNoOfActiveJobCards}
            icon="✅"
            color="green"
            explanation="कितने जॉब कार्ड सक्रिय हैं / Job cards currently active"
          />
          <DataCard
            titleHi="सक्रिय कार्यकर्ता"
            titleEn="Active Workers"
            value={data.totalNoOfActiveWorkers}
            icon="💪"
            color="blue"
            explanation="कितने लोग सक्रिय रूप से काम कर रहे हैं / People actively working"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
        <h4 className="text-xl font-bold text-green-800 mb-3">
          ℹ️ यह जानकारी क्यों महत्वपूर्ण है? / Why Is This Information Important?
        </h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>यह आपको बताता है कि आपके जिले में मनरेगा योजना कैसे काम कर रही है</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-sm text-gray-600">It shows you how the MGNREGA scheme is performing in your district</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>आप देख सकते हैं कि कितने लोगों को काम मिल रहा है और कितना वेतन मिल रहा है</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-sm text-gray-600">You can see how many people are getting work and what wages they receive</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>यह पारदर्शिता लाता है और सरकार को जवाबदेह बनाता है</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-sm text-gray-600">This brings transparency and makes the government accountable</span>
          </li>
        </ul>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        <p>
          अंतिम अपडेट / Last Updated: {new Date(data.updatedAt).toLocaleDateString('en-IN')}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
