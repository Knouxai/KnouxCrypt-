import React from 'react';

const DiskCard = ({ disk, isSelected, onClick }) => {
  // Calculate usage percentage
  const usedGB = parseInt(disk.used.replace('GB', '').replace('TB', '000'));
  const totalGB = parseInt(disk.size.replace('GB', '').replace('TB', '000'));
  const usagePercentage = Math.round((usedGB / totalGB) * 100);
  
  return (
    <div 
      className={`glass-card p-4 cursor-pointer transition-all duration-300 ${isSelected ? 'border-neon-purple shadow-neon-purple-glow' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-100">{disk.name}</span>
            <span className="ml-2 text-gray-400">{disk.label}</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">{disk.type}</div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          disk.status === 'encrypted' 
            ? 'bg-green-900 bg-opacity-30 text-green-400' 
            : 'bg-red-900 bg-opacity-30 text-red-400'
        }`}>
          {disk.status === 'encrypted' ? 'Encrypted' : 'Unencrypted'}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
          <span>Usage</span>
          <span>{usagePercentage}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div 
            className={`h-2 rounded-full ${
              disk.status === 'encrypted' 
                ? 'bg-green-500' 
                : 'bg-neon-purple'
            }`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between text-sm">
        <div>
          <span className="text-gray-400">Size:</span>
          <span className="ml-1 text-gray-300">{disk.size}</span>
        </div>
        <div>
          <span className="text-gray-400">Free:</span>
          <span className="ml-1 text-gray-300">{disk.free}</span>
        </div>
      </div>
      
      {disk.status === 'unencrypted' && (
        <button className="mt-3 w-full bg-neon-purple hover:bg-opacity-80 text-white py-1.5 rounded text-sm font-medium">
          Encrypt Now
        </button>
      )}
      
      {disk.status === 'encrypted' && (
        <button className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 rounded text-sm font-medium">
          Manage
        </button>
      )}
    </div>
  );
};

export default DiskCard;