import React from "react"
import { NavLink } from 'react-router-dom';


const NavButton = ({ to, icon: Icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className="flex items-center space-x-2 p-3 rounded-md text-gray-700 hover:bg-gray-200"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default NavButton;
