import React from 'react';

const DiskCard = ({ disk }) => {
  const { name, totalSpace, usedSpace, freeSpace, encryptionStatus, risk, lastChecked } = disk;
  
  // Calculate usage percentage for progress bar
  const usedPercentage = parseInt((usedSpace.replace(/[^0-9.]/g, '') / totalSpace.replace(/[^0-9.]/g, '')) * 100);
  
  // Determine color based on encryption status
  const isEncrypted = encryptionStatus.toLowerCase() === 'encrypted';
  const statusColor = isEncrypted ? 'text-green-400' : 'text-yellow-400';
  
  // Determine risk color
  const riskColor = 
    risk.toLowerCase() === 'high' ? 'text-red-500' : 
    risk.toLowerCase() === 'medium' ? 'text-yellow-400' : 
    'text-green-400';
  
  return (
    <div className="glass-morphism p-6 rounded-lg relative overflow-hidden">
      {/* Glow effect for encrypted disks */}
      {isEncrypted && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute -inset-1 bg-purple-600 opacity-20 blur-md"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-opacity-20 ${isEncrypted ? 'bg-green-900' : 'bg-yellow-900'}`}>
            {encryptionStatus}
          </span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>{usedSpace} used of {totalSpace}</span>
            <span>{freeSpace} free</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-2.5 rounded-full" 
              style={{ width: `${usedPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">Risk Level</p>
            <p className={`text-sm font-medium ${riskColor}`}>{risk}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Last Checked</p>
            <p className="text-sm text-gray-300">{lastChecked}</p>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          {isEncrypted ? (
            <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 px-3 rounded-lg text-sm transition-all duration-300">
              Decrypt
            </button>
          ) : (
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg text-sm transition-all duration-300">
              Encrypt
            </button>
          )}
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 px-3 rounded-lg text-sm transition-all duration-300">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiskCard;