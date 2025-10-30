import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-md border-b-4 border-orange-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Indian Flag Colors */}
            <div className="flex flex-col">
              <div className="w-16 h-2 bg-orange-500"></div>
              <div className="w-16 h-2 bg-white border border-gray-300"></div>
              <div className="w-16 h-2 bg-green-600"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                हमारी आवाज, हमारे अधिकार
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Our Voice, Our Rights - MGNREGA Portal
              </p>
            </div>
          </div>
          
          {/* Info Badge */}
          <div className="hidden md:block">
            <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2">
              <p className="text-sm font-semibold text-green-800">
                12.15 करोड़ लोगों ने 2025 में लाभ उठाया
              </p>
              <p className="text-xs text-green-700">
                12.15 Crore people benefited in 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
