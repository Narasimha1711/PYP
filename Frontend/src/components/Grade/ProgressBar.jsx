import React from 'react';
import PropTypes from 'prop-types';

export const ProgressBar = ({ value, max, label }) => {
  const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const percentage = max > 0 ? Math.min((validValue / max) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{validValue.toFixed(2)}</span>
      </div>
      <div
        className="w-full bg-gray-100 rounded-full h-3"
        role="progressbar"
        aria-valuenow={validValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="h-3 rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: percentage > 0 ? '#6366F1' : 'transparent' }}
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

ProgressBar.defaultProps = {
  value: 0,
  max: 100,
  label: 'Progress',
};