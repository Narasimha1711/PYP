import React from 'react';
import PropTypes from 'prop-types';

export const ProgressBar = ({ value, max, label }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="bg-[#6366F1] h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};