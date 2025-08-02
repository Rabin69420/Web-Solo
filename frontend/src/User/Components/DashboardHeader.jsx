import React, { useState, useEffect } from 'react';
import { 
  User,
  Home,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Eye
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHeader = ({ currentPage, bookmarkedCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => {
    if (path === '/overview' && (location.pathname === '/overview' || location.pathname === '/')) {
      return true;
    }
    return location.pathname === path;
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsProfileDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a delay before closing
    const timeout = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 150); // 150ms delay
    setCloseTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    // Clear timeout when mouse enters dropdown
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Close immediately when leaving dropdown
    setIsProfileDropdownOpen(false);
  };

  const handleProfileSettings = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    navigate('/profile');
  };

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    logout();
    navigate('/');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/overview" className="flex items-center">
            <div className="text-3xl font-serif font-extrabold">
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">Rent</span>
              <span className="text-slate-900">Easy</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link
              to="/overview"
              className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                isActive('/overview')
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg' 
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Eye className="w-5 h-5 mr-2" />
              Overview
            </Link>
            <Link
              to="/browse"
              className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                isActive('/browse')
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg' 
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Properties
            </Link>
            <Link
              to="/saved"
              className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                isActive('/saved')
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg' 
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Bookmark className="w-5 h-5 mr-2" />
              Saved ({bookmarkedCount})
            </Link>
          </nav>
          
          {/* User Profile with Hover Dropdown */}
          <div className="flex items-center space-x-4">
            <div 
              className="hidden md:flex items-center space-x-4 profile-dropdown relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer">
                <div className="text-right">
                  <div className="text-base font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                    User
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center group-hover:from-amber-700 group-hover:to-amber-800 transition-all shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu with separate hover handlers */}
              {isProfileDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="px-6 py-4 border-b border-slate-100">
                    <p className="text-base font-semibold text-slate-900">User</p>
                    <p className="text-sm text-slate-500">user@gmail.com</p>
                  </div>
                  <button 
                    onClick={handleProfileSettings}
                    className="w-full flex items-center px-6 py-3 text-base text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Profile Settings
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center px-6 py-3 text-base text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-50"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-6">
            <div className="flex flex-col space-y-3">
              <Link
                to="/overview"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 ${
                  isActive('/overview')
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' 
                    : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Eye className="w-5 h-5 mr-3" />
                Overview
              </Link>
              <Link
                to="/browse"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 ${
                  isActive('/browse')
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' 
                    : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Explore Properties
              </Link>
              <Link
                to="/saved"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 ${
                  isActive('/saved')
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' 
                    : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Bookmark className="w-5 h-5 mr-3" />
                Saved ({bookmarkedCount})
              </Link>
              
              {/* Mobile Profile Options */}
              <div className="border-t border-slate-100 pt-6 mt-6">
                <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-900">User</div>
                  </div>
                </div>
                <button 
                  onClick={handleProfileSettings}
                  className="w-full flex items-center px-4 py-3 text-base text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Settings
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-3 text-base text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
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

export default DashboardHeader;
