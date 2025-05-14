import React from 'react';
import PropTypes from 'prop-types';

const grades = ['O', 'A', 'B', 'C', 'D', 'P'];

export const GradeSelect = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#6366F1] focus:ring focus:ring-[#6366F1] focus:ring-opacity-50"
    >
      <option value="">Select</option>
      {grades.map((grade) => (
        <option key={grade} value={grade}>
          {grade}
        </option>
      ))}
    </select>
  );
};

GradeSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

GradeSelect.defaultProps = {
  value: '',
};