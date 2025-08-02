import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Signup = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address || ''
      };
      
      if (data.phone && data.phone.trim()) {
        userData.phone = data.phone.trim();
      }
      
      const result = await registerUser(userData);
      
      if (result.success) {
        if (isAdmin()) {
          navigate('/admin/dashboard');
        } else {
          navigate('/overview');
        }
      } else {
        if (result.errors && result.errors.length > 0) {
          setError(result.errors.map(err => err.message).join(', '));
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative pt-28 pb-12 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-200"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-400"></div>
        </div>

        {/* Signup Form */}
        <div className="relative w-full max-w-lg">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-amber-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-3">
                Join RentEasy
              </h1>
              <p className="text-slate-600 text-lg">
                Create an account to begin your rental journey.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    })}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-slate-900 placeholder-slate-400 
                      bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                      transition-all duration-300 ${
                        errors.name
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-amber-200 hover:border-amber-300"
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.name.message}
                  </p>
                )}
              </div>

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

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone", {
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-slate-900 placeholder-slate-400 
                      bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                      transition-all duration-300 ${
                        errors.phone
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-amber-200 hover:border-amber-300"
                      }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.phone.message}
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
                    placeholder="Create a strong password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Must contain uppercase, lowercase, and number"
                      }
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-slate-900 placeholder-slate-400 
                      bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                      transition-all duration-300 ${
                        errors.confirmPassword
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-amber-200 hover:border-amber-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("terms", {
                      required: "You must agree to the terms and conditions"
                    })}
                    className="w-5 h-5 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 focus:ring-2 mt-0.5"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-amber-600 hover:text-amber-700 hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-amber-600 hover:text-amber-700 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.terms.message}
                  </p>
                )}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-slate-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
