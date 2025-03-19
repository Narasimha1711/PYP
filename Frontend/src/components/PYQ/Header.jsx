import React from 'react';
import { GraduationCap, Star, ClipboardList, User } from 'lucide-react';
import NavButton from './NavButton';

const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <GraduationCap className="text-indigo-600" size={28} />
        <span className="text-xl font-semibold text-gray-900">ExamPrep</span>
      </div>
      <nav className="hidden md:flex items-center space-x-2">
        <NavButton icon={Star} label="PYP" />
        <NavButton icon={ClipboardList} label="Grade Sheet" />
        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        <button className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="relative">
            <User size={20} className="text-gray-700" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-medium text-gray-700">Profile</span>
        </button>
      </nav>
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
        <User size={20} className="text-gray-700" />
      </button>
    </div>
  </header>
);

export default Header;