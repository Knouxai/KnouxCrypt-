import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChart = () => {
  // Mock data for risk assessment of different disk types
  const data = [
    {
      name: 'System Disk',
      risk: 85,
      fill: '#F87171' // Red for high risk
    },
    {
      name: 'Data Disk',
      risk: 30,
      fill: '#34D399' // Green for low risk
    },
    {
      name: 'External',
      risk: 60,
      fill: '#F59E0B' // Amber for medium risk
    },
    {
      name: 'Backup',
      risk: 45,
      fill: '#60A5FA' // Blue for medium-low risk
    }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { risk, fill } = payload[0].payload;
      let riskLevel = 'Unknown';
      
      if (risk >= 70) riskLevel = 'High Risk';
      else if (risk >= 50) riskLevel = 'Medium Risk';
      else if (risk >= 30) riskLevel = 'Low Risk';
      else riskLevel = 'Very Low Risk';
      
      return (
        <div className="glass-morphism p-3 text-sm">
          <p className="text-gray-200 font-medium mb-1">{label}</p>
          <p style={{ color: fill }}>Risk Score: {risk}%</p>
          <p className="text-xs mt-1" style={{ color: fill }}>{riskLevel}</p>
          {label === 'System Disk' && (
            <p className="text-xs text-gray-400 mt-1">
              Contains sensitive OS files, high priority for encryption
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              value: 'Risk Score (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#94A3B8', fontSize: '12px' }
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          <Legend />
          <Bar 
            dataKey="risk" 
            name="Risk Level" 
            fill="#D946EF"
            radius={[4, 4, 0, 0]}
            background={{ fill: 'rgba(255, 255, 255, 0.08)' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;