import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const PieChart = () => {
  // Mock data for encryption distribution
  const data = [
    { name: 'Encrypted', value: 50, color: '#D946EF' }, // Neon purple for encrypted
    { name: 'Unencrypted', value: 50, color: '#94A3B8' }, // Gray for unencrypted
  ];

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism p-2 text-sm">
          <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-300">{entry.value}: {entry.payload.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            blendStroke
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} stroke="rgba(255, 255, 255, 0.1)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;