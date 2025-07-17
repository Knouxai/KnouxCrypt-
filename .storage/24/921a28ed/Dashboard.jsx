import React from 'react';
import GaugeChart from './charts/GaugeChart';
import PieChart from './charts/PieChart';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import StatsCard from './StatsCard';
import DiskCard from './DiskCard';

const Dashboard = () => {
  // Mock data for disks
  const disks = [
    {
      id: 1,
      name: 'System Disk (C:)',
      totalSpace: '512GB',
      usedSpace: '215GB',
      freeSpace: '297GB',
      encryptionStatus: 'Unencrypted',
      risk: 'High',
      lastChecked: '2 hours ago'
    },
    {
      id: 2,
      name: 'Data Disk (D:)',
      totalSpace: '1TB',
      usedSpace: '750GB',
      freeSpace: '250GB',
      encryptionStatus: 'Encrypted',
      risk: 'Low',
      lastChecked: '1 day ago'
    },
    {
      id: 3,
      name: 'External Drive (E:)',
      totalSpace: '2TB',
      usedSpace: '1.2TB',
      freeSpace: '800GB',
      encryptionStatus: 'Encrypted',
      risk: 'Low',
      lastChecked: '3 days ago'
    },
    {
      id: 4,
      name: 'Backup Drive (F:)',
      totalSpace: '4TB',
      usedSpace: '3.5TB',
      freeSpace: '500GB',
      encryptionStatus: 'Unencrypted',
      risk: 'Medium',
      lastChecked: '5 days ago'
    }
  ];

  // Stats data
  const stats = [
    { title: 'Protected Files', value: '4,856', change: '+12%', changeType: 'increase' },
    { title: 'Encryption Methods', value: '3', change: '+1', changeType: 'increase' },
    { title: 'Security Score', value: '87/100', change: '+5', changeType: 'increase' },
    { title: 'Threat Detections', value: '0', change: '-3', changeType: 'decrease' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Security Status</h2>
          <GaugeChart value={75} min={0} max={100} title="Security Score" />
          <p className="text-gray-300 text-sm text-center mt-2">
            Your overall encryption security is good but there's room for improvement
          </p>
        </div>

        <div className="glass-morphism p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Encryption Distribution</h2>
          <PieChart />
          <p className="text-gray-300 text-sm text-center mt-2">
            50% of your disks are currently encrypted with KnouxCrypt™
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Disk Performance</h2>
          <LineChart />
          <p className="text-gray-300 text-sm text-center mt-2">
            Minimal performance impact after encryption
          </p>
        </div>

        <div className="glass-morphism p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Risk Assessment</h2>
          <BarChart />
          <p className="text-gray-300 text-sm text-center mt-2">
            System disk has highest risk due to unencrypted status
          </p>
        </div>
      </div>

      <div className="glass-morphism p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Your Drives</h2>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Drive
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {disks.map(disk => (
            <DiskCard key={disk.id} disk={disk} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;