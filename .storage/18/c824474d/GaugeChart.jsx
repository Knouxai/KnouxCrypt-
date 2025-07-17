import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value, min, max, title }) => {
  const gaugeValue = Math.min(Math.max(value, min), max);
  const percentage = ((gaugeValue - min) / (max - min)) * 100;
  
  // Create data for the gauge chart
  const data = [
    { name: 'complete', value: percentage },
    { name: 'incomplete', value: 100 - percentage }
  ];

  // Colors for the gauge
  const COLORS = ['#D946EF', '#374151'];
  
  // Custom label for the center of the gauge
  const renderCustomizedLabel = () => {
    return (
      <g>
        <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#ffffff" fontSize={24} fontWeight="bold">
          {value}%
        </text>
        {title && (
          <text x="50%" y="68%" textAnchor="middle" fill="#9CA3AF" fontSize={12}>
            {title}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GaugeChart;