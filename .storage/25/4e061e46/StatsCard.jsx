import React from 'react';

const StatsCard = ({ title, value, change, changeType }) => {
  return (
    <div className="glass-morphism p-4 rounded-lg">
      <div className="flex flex-col">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className="flex items-end justify-between mt-1">
          <p className="text-white text-2xl font-semibold">{value}</p>
          <span className={`flex items-center text-xs font-medium ${
            changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          }`}>
            {changeType === 'increase' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
            )}
            {change}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;