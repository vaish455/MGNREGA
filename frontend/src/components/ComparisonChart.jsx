import React from 'react';

function ComparisonChart({ districtData, stateAverage, districtName, stateName }) {
  const formatNumber = (num) => {
    if (!num) return 0;
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(numValue) ? 0 : numValue;
  };

  const districtWage = formatNumber(districtData.averageWageRatePerDayPerPerson);
  const stateWage = formatNumber(stateAverage.averageWageRate);
  
  const districtDays = formatNumber(districtData.averageDaysOfEmploymentProvidedPerHousehold);
  const stateDays = formatNumber(stateAverage.averageDaysOfEmployment);

  const ComparisonBar = ({ label, districtValue, stateValue, unit = '' }) => {
    const maxValue = Math.max(districtValue, stateValue);
    const districtPercent = maxValue > 0 ? (districtValue / maxValue) * 100 : 0;
    const statePercent = maxValue > 0 ? (stateValue / maxValue) * 100 : 0;
    
    const isDistrictBetter = districtValue > stateValue;

    return (
      <div className="mb-6">
        <h4 className="font-bold text-lg text-gray-800 mb-3">{label}</h4>
        
        <div className="space-y-3">
          {/* District Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-700">
                {districtName}
              </span>
              <span className="text-lg font-bold text-blue-700">
                {unit}{districtValue.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDistrictBetter ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${districtPercent}%` }}
              >
                {isDistrictBetter && districtPercent > 15 && (
                  <span className="text-white text-xs font-bold px-2 leading-6">
                    बेहतर / Better ✓
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* State Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-700">
                {stateName} (औसत / Average)
              </span>
              <span className="text-lg font-bold text-gray-700">
                {unit}{stateValue.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  !isDistrictBetter ? 'bg-green-500' : 'bg-gray-400'
                }`}
                style={{ width: `${statePercent}%` }}
              >
                {!isDistrictBetter && statePercent > 15 && (
                  <span className="text-white text-xs font-bold px-2 leading-6">
                    बेहतर / Better ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Difference Indicator */}
        <div className="mt-2 text-sm text-gray-600">
          {districtValue > stateValue ? (
            <span className="text-green-700 font-semibold">
              ↑ राज्य औसत से {((districtValue / stateValue - 1) * 100).toFixed(1)}% अधिक / 
              {((districtValue / stateValue - 1) * 100).toFixed(1)}% higher than state average
            </span>
          ) : districtValue < stateValue ? (
            <span className="text-orange-700 font-semibold">
              ↓ राज्य औसत से {((1 - districtValue / stateValue) * 100).toFixed(1)}% कम / 
              {((1 - districtValue / stateValue) * 100).toFixed(1)}% lower than state average
            </span>
          ) : (
            <span className="text-gray-700 font-semibold">
              = राज्य औसत के बराबर / Equal to state average
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <ComparisonBar
          label="औसत दैनिक वेतन / Average Daily Wage"
          districtValue={districtWage}
          stateValue={stateWage}
          unit="₹"
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <ComparisonBar
          label="औसत रोजगार दिवस / Average Employment Days"
          districtValue={districtDays}
          stateValue={stateDays}
          unit=""
        />
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-2">📊 सारांश / Summary:</h4>
        <p className="text-gray-700 leading-relaxed">
          {districtWage > stateWage && districtDays > stateDays ? (
            <>
              🎉 <strong>बधाई हो!</strong> आपका जिला राज्य के औसत से बेहतर प्रदर्शन कर रहा है!
              <br />
              <span className="text-sm">
                <strong>Congratulations!</strong> Your district is performing better than the state average!
              </span>
            </>
          ) : districtWage < stateWage && districtDays < stateDays ? (
            <>
              ⚠️ आपका जिला राज्य के औसत से पीछे है। सुधार की गुंजाइश है।
              <br />
              <span className="text-sm">
                Your district is behind the state average. There is scope for improvement.
              </span>
            </>
          ) : (
            <>
              आपका जिला कुछ क्षेत्रों में बेहतर है और कुछ में सुधार की जरूरत है।
              <br />
              <span className="text-sm">
                Your district is better in some areas and needs improvement in others.
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default ComparisonChart;
