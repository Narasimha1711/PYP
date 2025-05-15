import React, { useState, useEffect } from 'react';
import { GraduationCap, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../app/userSlice';
import { useCompleteGoogleSignupMutation } from '../../app/userApi';

function CompleteSignup() {
  const [rollNo, setRollNo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [completeGoogleSignup, { isLoading }] = useCompleteGoogleSignupMutation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tempToken = params.get('tempToken');
    if (!tempToken) {
      setErrorMessage('Invalid or missing token. Please try signing up again.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const params = new URLSearchParams(location.search);
    const tempToken = params.get('tempToken');

    try {
      const response = await completeGoogleSignup({ rollNo, tempToken }).unwrap();
      dispatch(setUserInfo({ id: rollNo }));
      navigate('/pyp');
    } catch (err) {
      setErrorMessage(err?.data?.message || 'Failed to complete signup. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ExamPrep</h1>
          <p className="text-gray-600 mt-2">Complete your signup</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center justify-between">
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white transition-colors duration-200 ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? 'Completing Signup...' : 'Complete Signup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteSignup;