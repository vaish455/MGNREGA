import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function AboutPage({ onBack }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-blue-600 transition-all border border-gray-200 hover:border-blue-300 animate-slide-in-left"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">{language === 'hi' ? 'वापस जाएं' : 'Back'}</span>
        </button>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-xl shadow-lg p-8 md:p-12 text-white mb-8 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'hi' ? 'हमारी आवाज़, हमारे अधिकार' : 'Our Voice, Our Rights'}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {language === 'hi' 
              ? 'मनरेगा डेटा को सभी के लिए सुलभ बनाना' 
              : 'Making MGNREGA Data Accessible to All'}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            {language === 'hi' ? 'हमारा मिशन' : 'Our Mission'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {language === 'hi' 
              ? 'हमारा लक्ष्य मनरेगा (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम) के डेटा को ग्रामीण भारत के आम नागरिकों के लिए सरल और समझने योग्य बनाना है। सरकारी डेटा सभी के लिए उपलब्ध होना चाहिए, न केवल तकनीकी रूप से जानकार लोगों के लिए।'
              : 'Our mission is to make MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data simple and understandable for common citizens in rural India. Government data should be accessible to everyone, not just technically savvy individuals.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {language === 'hi'
              ? 'हम जटिल सरकारी डेटा को सरल, दृश्य प्रस्तुतीकरण में बदलते हैं जिसे कोई भी समझ सकता है।'
              : 'We transform complex government data into simple, visual presentations that anyone can understand.'}
          </p>
        </div>

        {/* What is MGNREGA Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">📖</span>
            {language === 'hi' ? 'मनरेगा क्या है?' : 'What is MGNREGA?'}
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'hi'
                ? 'मनरेगा भारत सरकार द्वारा चलाई जाने वाली विश्व की सबसे बड़ी रोजगार गारंटी योजना है। यह योजना ग्रामीण परिवारों को साल में कम से कम 100 दिन का गारंटीकृत रोजगार प्रदान करती है।'
                : 'MGNREGA is the world\'s largest employment guarantee scheme run by the Government of India. It provides at least 100 days of guaranteed employment in a year to rural households.'}
            </p>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <h3 className="font-bold text-lg text-orange-800 mb-2">
                {language === 'hi' ? 'मुख्य विशेषताएं:' : 'Key Features:'}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {language === 'hi'
                    ? '100 दिन का गारंटीकृत रोजगार प्रति वर्ष'
                    : '100 days of guaranteed employment per year'}
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {language === 'hi'
                    ? 'न्यूनतम मजदूरी की गारंटी'
                    : 'Guaranteed minimum wage'}
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {language === 'hi'
                    ? '15 दिन के भीतर मजदूरी का भुगतान'
                    : 'Payment within 15 days'}
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {language === 'hi'
                    ? 'महिला सशक्तिकरण (33% आरक्षण)'
                    : 'Women empowerment (33% reservation)'}
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {language === 'hi'
                    ? 'ग्रामीण बुनियादी ढांचे का विकास'
                    : 'Development of rural infrastructure'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">✨</span>
            {language === 'hi' ? 'हमारे फीचर्स' : 'Our Features'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="border-2 border-blue-100 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'hi' ? 'जिला चयन' : 'District Selection'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'अपना जिला खोजें या स्वतः पता लगाने दें। सरल और तेज़।'
                  : 'Find your district or auto-detect. Simple and fast.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-green-100 rounded-lg p-6 hover:border-green-300 transition-colors">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'hi' ? 'दृश्य डैशबोर्ड' : 'Visual Dashboard'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'रंगीन चार्ट और ग्राफ़ के साथ डेटा को समझें।'
                  : 'Understand data with colorful charts and graphs.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-purple-100 rounded-lg p-6 hover:border-purple-300 transition-colors">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'hi' ? 'तुलना उपकरण' : 'Comparison Tool'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'कई राज्यों और जिलों की तुलना करें।'
                  : 'Compare multiple states and districts.'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-2 border-orange-100 rounded-lg p-6 hover:border-orange-300 transition-colors">
              <div className="text-4xl mb-3">🗣️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'hi' ? 'द्विभाषी' : 'Bilingual'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'हिंदी और अंग्रेजी दोनों में उपलब्ध।'
                  : 'Available in both Hindi and English.'}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="border-2 border-red-100 rounded-lg p-6 hover:border-red-300 transition-colors">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'hi' ? 'मोबाइल फ्रेंडली' : 'Mobile Friendly'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'किसी भी डिवाइस पर काम करता है।'
                  : 'Works on any device.'}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="border-2 border-pink-100 rounded-lg p-6 hover:border-pink-300 transition-colors">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'hi' ? 'AI चैटबॉट' : 'AI Chatbot'}
              </h3>
              <p className="text-gray-600">
                {language === 'hi'
                  ? 'अपने प्रश्नों के उत्तर पाएं।'
                  : 'Get answers to your questions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">💻</span>
            {language === 'hi' ? 'तकनीकी विवरण' : 'Technology'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {language === 'hi'
              ? 'यह प्लेटफ़ॉर्म आधुनिक वेब तकनीकों का उपयोग करके बनाया गया है और डेटा सरकार के आधिकारिक API से सीधे प्राप्त किया जाता है।'
              : 'This platform is built using modern web technologies and data is fetched directly from the government\'s official API.'}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⚛️</div>
              <p className="font-semibold text-gray-800">React</p>
              <p className="text-sm text-gray-600">Frontend</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🟢</div>
              <p className="font-semibold text-gray-800">Node.js</p>
              <p className="text-sm text-gray-600">Backend</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🗄️</div>
              <p className="font-semibold text-gray-800">PostgreSQL</p>
              <p className="text-sm text-gray-600">Database</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">👥</span>
            {language === 'hi' ? 'हमारे बारे में' : 'About Us'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {language === 'hi'
              ? 'हम डेवलपर्स, डिज़ाइनर्स और सामाजिक कार्यकर्ताओं की एक टीम हैं जो ग्रामीण भारत को सशक्त बनाने के लिए प्रतिबद्ध हैं। हम मानते हैं कि सूचना तक पहुंच एक मौलिक अधिकार है।'
              : 'We are a team of developers, designers, and social workers committed to empowering rural India. We believe that access to information is a fundamental right.'}
          </p>
          <div className="bg-gradient-to-r from-orange-100 to-green-100 rounded-lg p-6">
            <p className="text-center text-xl font-semibold text-gray-800 italic">
              {language === 'hi'
                ? '"डेटा सभी के लिए है, न केवल कुछ चुनिंदा लोगों के लिए"'
                : '"Data is for everyone, not just the privileged few"'}
            </p>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 md:p-8 text-white mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <span className="text-3xl mr-3">🚀</span>
            {language === 'hi' ? 'हमारा प्रभाव' : 'Our Impact'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">28</div>
              <p className="text-lg opacity-90">
                {language === 'hi' ? 'राज्य कवर किए गए' : 'States Covered'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">700+</div>
              <p className="text-lg opacity-90">
                {language === 'hi' ? 'जिले' : 'Districts'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-lg opacity-90">
                {language === 'hi' ? 'निःशुल्क' : 'Free'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">📧</span>
            {language === 'hi' ? 'संपर्क करें' : 'Get in Touch'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {language === 'hi'
              ? 'क्या आपके पास कोई सुझाव है या मदद की आवश्यकता है? हम आपकी मदद के लिए यहाँ हैं!'
              : 'Have suggestions or need help? We\'re here to assist you!'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              {language === 'hi' ? 'सुझाव दें' : 'Send Feedback'}
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors">
              {language === 'hi' ? 'मदद केंद्र' : 'Help Center'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            {language === 'hi'
              ? 'ग्रामीण भारत के लिए ❤️ के साथ बनाया गया'
              : 'Built with ❤️ for rural India'}
          </p>
          <p className="text-xs mt-2">
            {language === 'hi'
              ? 'डेटा स्रोत: data.gov.in (भारत सरकार का आधिकारिक ओपन डेटा पोर्टल)'
              : 'Data Source: data.gov.in (Government of India\'s Official Open Data Portal)'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
