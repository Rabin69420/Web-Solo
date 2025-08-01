import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminHeader from './AdminDashboardHeader';
import PropertyDetailsModal from './PropertydetailsModel';


const AdminViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (location.state && location.state.property) {
      setProperty(location.state.property);
      if (location.state.bookmarkedProperties) {
        setBookmarkedProperties(location.state.bookmarkedProperties);
      }
    } else {
      navigate('/admin/properties'); 
    }
  }, [location.state, navigate]);

  const toggleBookmark = (propertyId) => {
    setBookmarkedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AdminHeader currentPage="viewdetails" />
      
     
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <PropertyDetailsModal
          isOpen={true}
          property={property}
          onClose={handleClose}
          bookmarkedProperties={bookmarkedProperties}
          toggleBookmark={toggleBookmark}
          isFullPage={true}
        />
      </div>

    </div>
  );
};

export default AdminViewDetails;
