import React from 'react';
import { GraduationCap, Star, ClipboardList, User, LogOut } from 'lucide-react';
import NavButton from './NavButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUserInfo } from '../../app/userSlice';
import { useUserLogoutMutation } from '../../app/userApi';
import { toast } from 'react-toastify';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ userLogout, {error, data, isError } ] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
      dispatch(clearUserInfo());
      navigate('/signin', { replace: true });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch(clearUserInfo());
      navigate('/signin', { replace: true });
      toast.error('Logout failed, but session cleared');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="text-indigo-600" size={28} />
          <span className="text-xl font-semibold text-gray-900">ExamPrep</span>
        </div>
        <nav className="hidden md:flex items-center space-x-2">
          <NavButton to="/pyp" icon={Star} label="PYP" />
          <NavButton to="/grade" icon={ClipboardList} label="Grade Sheet" />
          <NavButton to="/userTimeTable" icon={ClipboardList} label="Time Table" />
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/profile')}
          >
            <div className="relative">
              <User size={20} className="text-gray-700" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="font-medium text-gray-700">Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={20} className="text-gray-700" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
        <div className="flex items-center space-x-2 md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => navigate('/profile')}
          >
            <User size={20} className="text-gray-700" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <LogOut size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;