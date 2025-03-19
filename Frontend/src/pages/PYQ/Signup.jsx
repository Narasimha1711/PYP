import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserSignupMutation } from '../../app/userApi';


function SignUp() {
  const [rollNo, setRollNo] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const [signup, { isLoading }] = useUserSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message before submitting

    try {
      const response = await signup({ rollNo, name, email, password }).unwrap();
      navigate('/signin'); // Redirect to login after successful signup
    } catch (error) {
      setErrorMessage(error?.data?.message || 'Signup failed. Please try again.');
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
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                placeholder="Enter your roll number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                placeholder="Choose a name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                placeholder="Choose a password"
                required
              />
            </div>

            <div className="text-center">
              <Link to="/signin" className="text-indigo-600 hover:text-indigo-700 text-sm">
                Already have an account? Sign in
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg 
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:ring-offset-2 transition-colors duration-200 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
