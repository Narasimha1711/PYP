import React, { useEffect, useState } from 'react';
import { GraduationCap, Lock, ArrowRight, UserCircle } from 'lucide-react';
import { useUserLoginMutation } from '../../app/userApi';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../app/userSlice';

function Signin() {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data: data, isLoading, error }] = useUserLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here

    try {
        const response = await login({ rollNo, password }).unwrap();
        dispatch(setUserInfo({id: rollNo}));
        navigate('/pyp')
      } catch (err) {
        setApiError(err?.data?.message || "Invalid Credentials");
      }


    // useEffect(() => {
        
    // }, [data])

  };

  return (
    <>
    {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}

    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ExamPrep</h1>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="rollNo"
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
              <a href="/signup" className="text-sm text-indigo-600 hover:text-indigo-500">
                Create account
              </a>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <span>Sign In</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Signin;