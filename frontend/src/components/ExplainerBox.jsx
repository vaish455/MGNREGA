import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function ExplainerBox() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, language } = useLanguage();

  const content = {
    en: {
      shortDesc: "MGNREGA is a government scheme that provides at least 100 days of wage employment in a year to rural households.",
      objectives: "Main Objectives:",
      obj1: "Employment guarantee: Every family should get 100 days of work",
      obj2: "Reduce poverty: Provide income source to poor families",
      obj3: "Infrastructure: Build roads, ponds, etc. in villages",
      obj4: "Women empowerment: Equal work and wages for women",
      benefits: "What Do You Get?",
      ben1: "Daily wage: Fixed by state government (usually ₹200-300)",
      ben2: "Payment within 15 days: You should receive payment within 15 days of work",
      ben3: "Job Card: You get a job card to request work",
      howToApply: "How to Apply?",
      step1: "Go to your Gram Panchayat",
      step2: "Apply for Job Card (with all adult family members)",
      step3: "You will receive Job Card within 15 days",
      step4: "Request work with your Job Card",
      knowRights: "Know Your Rights:",
      right1: "If you don't get work within 15 days, you should receive unemployment allowance",
      right2: "Work site must have drinking water and rest facilities",
      right3: "Women should receive equal wages as men",
      showLess: "Show Less",
      learnMore: "Learn More"
    },
    hi: {
      shortDesc: "मनरेगा एक सरकारी योजना है जो ग्रामीण क्षेत्र के परिवारों को साल में कम से कम 100 दिन का काम देती है।",
      objectives: "योजना के मुख्य उद्देश्य:",
      obj1: "रोजगार की गारंटी: हर परिवार को 100 दिन का काम मिलना चाहिए",
      obj2: "गरीबी कम करना: गरीब परिवारों को आय का स्रोत देना",
      obj3: "बुनियादी ढांचा: गाँवों में सड़क, तालाब, आदि बनाना",
      obj4: "महिला सशक्तिकरण: महिलाओं को भी बराबर काम और वेतन",
      benefits: "आपको क्या मिलता है?",
      ben1: "प्रति दिन वेतन: राज्य सरकार द्वारा तय किया गया (आमतौर पर ₹200-300)",
      ben2: "15 दिनों में भुगतान: काम करने के 15 दिन के अंदर पैसे मिलने चाहिए",
      ben3: "जॉब कार्ड: आपको एक जॉब कार्ड मिलता है जिससे आप काम मांग सकते हैं",
      howToApply: "कैसे आवेदन करें?",
      step1: "अपने ग्राम पंचायत में जाएं",
      step2: "जॉब कार्ड के लिए आवेदन करें (परिवार के सभी वयस्क सदस्यों के साथ)",
      step3: "15 दिन में आपको जॉब कार्ड मिल जाएगा",
      step4: "जॉब कार्ड के साथ काम की मांग करें",
      knowRights: "अपने अधिकार जानें:",
      right1: "अगर 15 दिन में काम नहीं मिलता, तो बेरोजगारी भत्ता मिलना चाहिए",
      right2: "काम की जगह पर पीने का पानी और आराम की सुविधा होनी चाहिए",
      right3: "महिलाओं को पुरुषों के बराबर वेतन मिलना चाहिए",
      showLess: "कम दिखाएं",
      learnMore: "और जानें"
    }
  };

  const c = content[language];

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-900 mb-2 flex items-center">
            {t('whatIsMGNREGA')}
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isExpanded ? `▲ ${c.showLess}` : `▼ ${c.learnMore}`}
        </button>
      </div>

      <div className="text-gray-700 leading-relaxed space-y-3">
        <p className="text-lg">
          {c.shortDesc}
        </p>

        {isExpanded && (
          <div className="mt-4 space-y-4 pt-4 border-t border-blue-200">
            <div>
              <h4 className="font-bold text-lg text-blue-900 mb-2">{c.objectives}</h4>
              <ul className="space-y-2 ml-6 list-disc">
                <li>{c.obj1}</li>
                <li>{c.obj2}</li>
                <li>{c.obj3}</li>
                <li>{c.obj4}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg text-blue-900 mb-2">{c.benefits}</h4>
              <ul className="space-y-2 ml-6 list-disc">
                <li>{c.ben1}</li>
                <li>{c.ben2}</li>
                <li>{c.ben3}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg text-blue-900 mb-2">{c.howToApply}</h4>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>{c.step1}</li>
                <li>{c.step2}</li>
                <li>{c.step3}</li>
                <li>{c.step4}</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
              <h4 className="font-bold text-yellow-900 mb-2">{c.knowRights}</h4>
              <ul className="space-y-1 text-sm list-disc ml-6">
                <li>{c.right1}</li>
                <li>{c.right2}</li>
                <li>{c.right3}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplainerBox;
