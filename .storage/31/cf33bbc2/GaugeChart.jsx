import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value = 75, min = 0, max = 100, title = "Security Score" }) => {
  // Calculate percentage of the value relative to min/max
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Data for the gauge chart
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Empty', value: 100 - percentage },
  ];
  
  // Colors based on percentage value
  const getColor = (percent) => {
    if (percent < 40) return '#EF4444'; // Red for low values
    if (percent < 70) return '#F59E0B'; // Yellow/amber for medium values
    return '#10B981'; // Green for high values
  };
  
  // Colors for the chart
  const COLORS = [getColor(percentage), '#334155'];
  
  // Label styles
  const valueText = {
    fontSize: '2rem',
    fontWeight: 'bold',
    fill: getColor(percentage),
  };
  
  const labelText = {
    fontSize: '0.875rem',
    fill: '#CBD5E1',
  };
  
  return (
    <div className="w-full h-72 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            blendStroke
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} strokeWidth={0} />
            ))}
          </Pie>
          <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" style={valueText}>
            {value}
          </text>
          <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" style={labelText}>
            {title}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GaugeChart;