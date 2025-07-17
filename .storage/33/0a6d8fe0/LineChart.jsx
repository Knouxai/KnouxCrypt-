import React from 'react';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = () => {
  // Mock data for disk performance before and after encryption
  const data = [
    { name: 'Read', encrypted: 420, unencrypted: 450 },
    { name: 'Write', encrypted: 380, unencrypted: 420 },
    { name: 'Random Read', encrypted: 410, unencrypted: 430 },
    { name: 'Random Write', encrypted: 370, unencrypted: 400 },
    { name: 'File Copy', encrypted: 360, unencrypted: 390 },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism p-3 text-sm">
          <p className="text-gray-200 font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} MB/s
            </p>
          ))}
          <p className="text-xs text-gray-400 mt-1">
            Impact: {Math.round((1 - (payload[0].value / payload[1].value)) * 100)}% slowdown
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94A3B8' }}
            stroke="rgba(255, 255, 255, 0.2)" 
          />
          <YAxis 
            tick={{ fill: '#94A3B8' }}
            stroke="rgba(255, 255, 255, 0.2)"
            label={{ 
              value: 'MB/s', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#94A3B8', fontSize: '12px' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="encrypted" 
            name="Encrypted" 
            stroke="#D946EF" 
            strokeWidth={2}
            dot={{ fill: '#D946EF', strokeWidth: 1, r: 4, strokeDasharray: '' }}
            activeDot={{ r: 6, fill: '#D946EF', stroke: 'white', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="unencrypted" 
            name="Unencrypted" 
            stroke="#38BDF8" 
            strokeWidth={2}
            dot={{ fill: '#38BDF8', strokeWidth: 1, r: 4, strokeDasharray: '' }}
            activeDot={{ r: 6, fill: '#38BDF8', stroke: 'white', strokeWidth: 2 }}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;