import React, { useState } from 'react';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="glass-morphism shadow-glass">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <div className="neon-purple-text text-2xl font-bold">KnouxCrypt™</div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-700 hover:bg-opacity-50 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center focus:outline-none"
            >
              <div className="w-10 h-10 bg-neon-purple bg-opacity-70 rounded-full flex items-center justify-center text-white font-bold shadow-neon-purple-glow">
                A
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-morphism rounded-md shadow-glass py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:bg-opacity-50">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:bg-opacity-50">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:bg-opacity-50">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;