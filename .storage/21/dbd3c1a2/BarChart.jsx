import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartComponent = () => {
  // Mock data for risk assessment of different disk types
  const data = [
    { name: 'System', risk: 85, status: 'unencrypted' },
    { name: 'Data', risk: 65, status: 'unencrypted' },
    { name: 'Backup', risk: 20, status: 'encrypted' },
    { name: 'External', risk: 15, status: 'encrypted' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism p-3 text-xs">
          <p className="text-gray-300 font-medium mb-1">{label}</p>
          <p className="text-neon-purple">{`Risk Level: ${payload[0].value}%`}</p>
          <p className="text-gray-400 mt-1 capitalize">{`Status: ${payload[0].payload.status}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} stroke="#4B5563" />
          <YAxis tick={{ fill: '#9CA3AF' }} stroke="#4B5563" />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="risk" 
            barSize={30}
            fill="#D946EF"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;