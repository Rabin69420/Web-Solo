import React from 'react';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignOut = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout();
    
    console.log('User logged out successfully');
    
    // Navigate to home/landing page
    navigate('/');
  };

  const handleCancel = () => {
    // Go back to the previous page
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      {/* Background Pattern - Kept the same */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-400 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-500 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-400"></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/overview" className="inline-block">
              <div className="text-3xl font-serif font-extrabold">
                <span className="text-orange-600">Rent</span>
                <span className="text-slate-900">Easy</span>
              </div>
            </Link>
          </div>

          {/* Logout Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-10 h-10 text-orange-600" />
          </div>

          {/* Title and Message */}
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            Sign Out
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Are you sure you want to sign out of your account?
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Confirm Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Yes, Sign Out
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="w-full bg-white border-2 border-slate-300 text-slate-700 font-semibold py-4 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            You can always sign back in anytime to access your saved properties and bookings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
