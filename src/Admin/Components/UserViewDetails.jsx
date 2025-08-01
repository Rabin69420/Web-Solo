import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminDashboardHeader';
import UserDetailsModal from '../Components/UserDetailsModal';

const AdminUserViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('AdminUserViewDetails mounted, location.state:', location.state);
    
    if (location.state && location.state.user) {
      setUser(location.state.user);
    } else {
      console.log('No user data found, redirecting to admin users');
      navigate('/admin/users');
    }
  }, [location.state, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  // Debug: Add console log to see if user data exists
  console.log('Current user data:', user);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AdminHeader currentPage="viewuserdetails" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <UserDetailsModal
          isOpen={true}
          user={user}
          onClose={handleClose}
          isFullPage={true}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminUserViewDetails;
