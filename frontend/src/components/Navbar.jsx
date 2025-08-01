import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, Heart, Calendar, Settings, LogOut, Building } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Building className="logo-icon" />
          <span>HotelHub</span>
        </Link>

        <div className="nav-menu">
          <Link to="/home" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/properties" className="nav-link">
            <Building size={18} />
            <span>Properties</span>
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="nav-link">
                  <Settings size={18} />
                  <span>Admin Panel</span>
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link">
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/favorites" className="nav-link">
                    <Heart size={18} />
                    <span>Favorites</span>
                  </Link>
                </>
              )}
              <Link to="/bookings" className="nav-link">
                <Calendar size={18} />
                <span>Bookings</span>
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={18} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="nav-buttons">
              <Link to="/login" className="nav-button login-button">
                <User size={18} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-button register-button">
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;