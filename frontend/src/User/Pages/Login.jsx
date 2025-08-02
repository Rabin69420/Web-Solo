import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login({ email: data.email, password: data.password });
      
      if (result.success) {
        // Store authentication token for logout functionality
        const mockToken = 'demo_token_' + Date.now();
        localStorage.setItem('token', mockToken);
        
        // Store user info
        const mockUser = {
          id: 1,
          email: data.email,
          name: 'User',
          role: isAdmin() ? 'admin' : 'user'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        if (isAdmin()) {
          navigate('/admin/dashboard');
        } else {
          navigate('/overview');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative pt-28 pb-12 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-200"></div>
        </div>

        {/* Login Form */}
        <div className="relative w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-amber-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-slate-600 text-lg">
                Sign in to your RentEasy account
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email",
                      },
                    })}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-slate-900 placeholder-slate-400 
                      bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                      transition-all duration-300 ${
                        errors.email
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-amber-200 hover:border-amber-300"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-slate-900 placeholder-slate-400 
                      bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                      transition-all duration-300 ${
                        errors.password
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-amber-200 hover:border-amber-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 
                  transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 transform hover:scale-[1.02] hover:shadow-xl'
                  }`}
              >
                {isLoading ? (
                   <>
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                     Signing In...
                   </>
                 ) : (
                   <>
                     Sign In
                     <ArrowRight size={20} />
                   </>
                 )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-slate-600">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
