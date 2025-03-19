import React from 'react';

const NavButton = ({ icon: Icon, label }) => (
  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default NavButton;