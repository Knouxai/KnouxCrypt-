import React, { useState } from 'react';
import GaugeChart from './charts/GaugeChart';
import PieChartComponent from './charts/PieChart';
import LineChartComponent from './charts/LineChart';
import BarChartComponent from './charts/BarChart';
import DiskCard from './DiskCard';

const Dashboard = () => {
  const [selectedDisk, setSelectedDisk] = useState(null);
  
  // Mock disk data
  const disks = [
    { id: 1, name: 'C:', label: 'System', size: '512GB', used: '320GB', free: '192GB', status: 'unencrypted', type: 'SSD' },
    { id: 2, name: 'D:', label: 'Data', size: '1TB', used: '400GB', free: '624GB', status: 'unencrypted', type: 'HDD' },
    { id: 3, name: 'E:', label: 'Backup', size: '2TB', used: '1.2TB', free: '800GB', status: 'encrypted', type: 'HDD' },
    { id: 4, name: 'F:', label: 'External', size: '256GB', used: '50GB', free: '206GB', status: 'encrypted', type: 'SSD' },
  ];

  const handleDiskSelect = (disk) => {
    setSelectedDisk(disk);
  };

  // Calculate encryption stats
  const totalDisks = disks.length;
  const encryptedDisks = disks.filter(disk => disk.status === 'encrypted').length;
  const encryptionPercentage = Math.round((encryptedDisks / totalDisks) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-100">Disk Encryption Dashboard</h1>
        <button className="bg-neon-purple hover:bg-opacity-80 text-white px-4 py-2 rounded-md shadow-neon-purple-glow flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Quick Scan
        </button>
      </div>
      
      {/* System Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Security Status</h3>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 pulse-glow"></div>
            <span className="text-xl font-bold text-gray-100">Protected</span>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Encrypted Disks</h3>
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-100">{encryptedDisks}/{totalDisks}</span>
            <div className="ml-2 bg-gray-700 rounded-full h-2 w-16">
              <div className="bg-neon-purple h-2 rounded-full shadow-neon-purple-glow" style={{ width: `${encryptionPercentage}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Password Strength</h3>
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-100">Strong</span>
            <div className="ml-2 text-neon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Storage</h3>
          <div className="text-xl font-bold text-gray-100">3.75 TB</div>
          <div className="text-sm text-gray-400">1.97 TB free</div>
        </div>
      </div>
      
      {/* Disk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Disk Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {disks.map((disk) => (
              <DiskCard 
                key={disk.id} 
                disk={disk} 
                isSelected={selectedDisk && selectedDisk.id === disk.id}
                onClick={() => handleDiskSelect(disk)}
              />
            ))}
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">System Security</h2>
          <GaugeChart value={encryptionPercentage} min={0} max={100} title="Encryption Status" />
          <div className="mt-4 text-sm text-gray-400 text-center">
            {encryptionPercentage}% of your disks are protected
          </div>
        </div>
      </div>
      
      {/* AI Recommendations */}
      <div className="glass-card p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium text-gray-100">AI Security Assistant</h2>
          <div className="ml-3 px-2 py-1 bg-neon-purple bg-opacity-20 rounded text-xs font-medium text-neon-purple">
            KnowxCrypt AI
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 space-y-3">
          <div className="flex">
            <div className="w-8 h-8 bg-neon-purple bg-opacity-40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-300">I recommend encrypting your <span className="font-medium text-neon-purple">C: System</span> drive as it contains sensitive OS files.</p>
              <p className="text-gray-400 text-sm mt-1">Recommended algorithm: AES-256-XTS</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-8 h-8 bg-neon-purple bg-opacity-40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-300">Your current encryption strategy leaves 50% of your data unprotected.</p>
            </div>
          </div>
          
          <button className="mt-3 w-full bg-neon-purple bg-opacity-20 hover:bg-opacity-30 text-neon-purple font-medium py-2 rounded-md transition-all duration-300">
            Apply Recommendations
          </button>
        </div>
      </div>
      
      {/* Charts - Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Encryption Status</h2>
          <PieChartComponent />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Performance Impact</h2>
          <LineChartComponent />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Risk Assessment</h2>
          <BarChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;