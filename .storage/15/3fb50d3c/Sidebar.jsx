import React, { useState } from 'react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      id: 'disk-manager', 
      name: 'Disk Manager', 
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' 
    },
    { 
      id: 'encryption', 
      name: 'Encryption', 
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' 
    },
    { 
      id: 'ai-assistant', 
      name: 'AI Assistant', 
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' 
    },
  ];

  return (
    <aside className="glass-morphism w-64 hidden md:block">
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-neon-purple bg-opacity-20 p-3 rounded-full shadow-neon-purple-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-3 text-sm rounded-md ${
                    activeItem === item.id
                      ? 'bg-neon-purple bg-opacity-20 text-neon-purple shadow-neon-purple-glow'
                      : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-30'
                  }`}
                  onClick={() => setActiveItem(item.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-700 border-opacity-40">
          <div className="glass-card p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Security Status</h4>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 pulse-glow"></div>
              <span className="text-sm text-green-400">Protected</span>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Last scan: Today at 10:45 AM
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;