import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChartComponent = () => {
  // Mock data for performance impact of encryption
  const data = [
    { name: 'Day 1', 'Read (MB/s)': 520, 'Write (MB/s)': 490 },
    { name: 'Day 2', 'Read (MB/s)': 510, 'Write (MB/s)': 480 },
    { name: 'Day 3', 'Read (MB/s)': 505, 'Write (MB/s)': 485 },
    { name: 'Day 4', 'Read (MB/s)': 508, 'Write (MB/s)': 478 },
    { name: 'Day 5', 'Read (MB/s)': 500, 'Write (MB/s)': 470 },
    { name: 'Day 6', 'Read (MB/s)': 495, 'Write (MB/s)': 465 },
    { name: 'Day 7', 'Read (MB/s)': 490, 'Write (MB/s)': 460 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism p-3 text-xs">
          <p className="text-gray-300 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} MB/s`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line 
            type="monotone" 
            dataKey="Read (MB/s)" 
            stroke="#D946EF" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="Write (MB/s)" 
            stroke="#8B5CF6" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;