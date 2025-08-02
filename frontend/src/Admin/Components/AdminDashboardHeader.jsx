import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = ({ currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  // Handle mouse enter - open dropdown immediately
  const handleMouseEnter = () => {
    // Clear any existing close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsProfileDropdownOpen(true);
  };

  // Handle mouse leave - close dropdown with delay
  const handleMouseLeave = () => {
    // Set timeout to close dropdown after 300ms delay
    closeTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 300);
  };

  // Handle dropdown mouse enter - cancel close timeout
  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Handle dropdown mouse leave - close with delay
  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 300);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center">
            <div className="text-2xl font-serif font-extrabold">
              <span className="text-orange-600">Rent</span>
              <span className="text-slate-900">Easy</span>
              <span className="text-sm font-normal text-gray-500 ml-2">Admin</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/admin/dashboard"
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/users')
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Link>
            <Link
              to="/admin/properties"
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/properties')
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Properties
            </Link>
          </nav>

          {/* Admin Profile with Hover Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu - Simplified with only user info and logout */}
              {isProfileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 opacity-100 transform scale-100 transition-all duration-200"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@renteasy.com</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/admin/dashboard')
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/admin/users')
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </Link>
              <Link
                to="/admin/properties"
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/admin/properties')
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4 mr-2" />
                Properties
              </Link>
              
              {/* Mobile Profile Options - Simplified */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
