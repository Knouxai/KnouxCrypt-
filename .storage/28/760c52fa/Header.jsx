import React from 'react';

const Header = () => {
  return (
    <header className="glass-morphism p-4 px-6 shadow-lg flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-purple-600 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">KnouxCrypt™</h1>
          <p className="text-xs text-gray-400">Secure Disk Encryption</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
        </div>
        
        <div className="hidden sm:block border-l border-gray-700 h-8 mx-2"></div>
        
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
            className="w-8 h-8 rounded-full mr-3"
          />
          <span className="text-gray-300 text-sm font-medium hidden md:inline-block">Alex Morgan</span>
        </div>
      </div>
    </header>
  );
};

export default Header;