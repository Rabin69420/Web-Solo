import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg fixed top-0 left-0 w-full z-50 border-b border-gold-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        <Link
          to="/"
          className="text-3xl font-serif font-bold hover:scale-105 transition-transform duration-300"
        >
          <span className="text-orange-600">Rent</span>
          <span className="text-slate-900">Easy</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/about"
            className="text-slate-700 hover:text-amber-600 font-medium transition-all duration-300 hover:underline decoration-amber-500 underline-offset-4"
          >
            About Us
          </Link>
          <Link
            to="/services"
            className="text-slate-700 hover:text-amber-600 font-medium transition-all duration-300 hover:underline decoration-amber-500 underline-offset-4"
          >
            Our Services
          </Link>
          <Link
            to="/contact"
            className="text-slate-700 hover:text-amber-600 font-medium transition-all duration-300 hover:underline decoration-amber-500 underline-offset-4"
          >
            Contact
          </Link>

          <div className="flex items-center space-x-3 border-l border-slate-200 pl-8">
            <Link
              to="/login"
              className="text-slate-700 hover:text-amber-600 font-medium px-4 py-2 rounded-lg hover:bg-amber-50 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-amber-700 hover:to-amber-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
