import React, { useState } from 'react';

function ExplainerBox() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-900 mb-2 flex items-center">
            <span className="mr-2">📚</span>
            मनरेगा (MGNREGA) क्या है?
          </h3>
          <p className="text-xl text-blue-800 mb-3">
            What is MGNREGA?
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isExpanded ? '▲ कम दिखाएं' : '▼ और जानें'}
        </button>
      </div>

      <div className="text-gray-700 leading-relaxed space-y-3">
        <p className="text-lg">
          <span className="font-semibold">मनरेगा एक सरकारी योजना है</span> जो ग्रामीण क्षेत्र के परिवारों को साल में कम से कम 100 दिन का काम देती है।
        </p>
        <p className="text-base text-gray-600">
          MGNREGA is a government scheme that provides at least 100 days of wage employment in a year to rural households.
        </p>

        {isExpanded && (
          <div className="mt-4 space-y-4 pt-4 border-t border-blue-200">
            <div>
              <h4 className="font-bold text-lg text-blue-900 mb-2">🎯 योजना के मुख्य उद्देश्य / Main Objectives:</h4>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>रोजगार की गारंटी:</strong> हर परिवार को 100 दिन का काम मिलना चाहिए
                    <br />
                    <span className="text-sm text-gray-600">Employment guarantee: Every family should get 100 days of work</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>गरीबी कम करना:</strong> गरीब परिवारों को आय का स्रोत देना
                    <br />
                    <span className="text-sm text-gray-600">Reduce poverty: Provide income source to poor families</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>बुनियादी ढांचा:</strong> गाँवों में सड़क, तालाब, आदि बनाना
                    <br />
                    <span className="text-sm text-gray-600">Infrastructure: Build roads, ponds, etc. in villages</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>महिला सशक्तिकरण:</strong> महिलाओं को भी बराबर काम और वेतन
                    <br />
                    <span className="text-sm text-gray-600">Women empowerment: Equal work and wages for women</span>
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg text-blue-900 mb-2">💰 आपको क्या मिलता है? / What Do You Get?</h4>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>प्रति दिन वेतन:</strong> राज्य सरकार द्वारा तय किया गया (आमतौर पर ₹200-300)
                    <br />
                    <span className="text-sm text-gray-600">Daily wage: Fixed by state government (usually ₹200-300)</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>15 दिनों में भुगतान:</strong> काम करने के 15 दिन के अंदर पैसे मिलने चाहिए
                    <br />
                    <span className="text-sm text-gray-600">Payment within 15 days: You should receive payment within 15 days of work</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>जॉब कार्ड:</strong> आपको एक जॉब कार्ड मिलता है जिससे आप काम मांग सकते हैं
                    <br />
                    <span className="text-sm text-gray-600">Job Card: You get a job card to request work</span>
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg text-blue-900 mb-2">📝 कैसे आवेदन करें? / How to Apply?</h4>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>
                  अपने ग्राम पंचायत में जाएं
                  <br />
                  <span className="text-sm text-gray-600">Go to your Gram Panchayat</span>
                </li>
                <li>
                  जॉब कार्ड के लिए आवेदन करें (परिवार के सभी वयस्क सदस्यों के साथ)
                  <br />
                  <span className="text-sm text-gray-600">Apply for Job Card (with all adult family members)</span>
                </li>
                <li>
                  15 दिन में आपको जॉब कार्ड मिल जाएगा
                  <br />
                  <span className="text-sm text-gray-600">You will receive Job Card within 15 days</span>
                </li>
                <li>
                  जॉब कार्ड के साथ काम की मांग करें
                  <br />
                  <span className="text-sm text-gray-600">Request work with your Job Card</span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
              <h4 className="font-bold text-yellow-900 mb-2">⚠️ अपने अधिकार जानें / Know Your Rights:</h4>
              <ul className="space-y-1 text-sm">
                <li>• अगर 15 दिन में काम नहीं मिलता, तो बेरोजगारी भत्ता मिलना चाहिए</li>
                <li className="text-gray-600">• If you don't get work within 15 days, you should receive unemployment allowance</li>
                <li>• काम की जगह पर पीने का पानी और आराम की सुविधा होनी चाहिए</li>
                <li className="text-gray-600">• Work site must have drinking water and rest facilities</li>
                <li>• महिलाओं को पुरुषों के बराबर वेतन मिलना चाहिए</li>
                <li className="text-gray-600">• Women should receive equal wages as men</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplainerBox;
