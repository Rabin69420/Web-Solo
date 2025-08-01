import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  ArrowLeft
} from 'lucide-react';

const UserDetailsModal = ({ 
  isOpen, 
  user, 
  onClose,
  isFullPage = false,
  isAdmin = false
}) => {
  if (!isOpen || !user) {
    console.log('UserDetailsModal not rendering:', { isOpen, user });
    return null;
  }

  console.log('UserDetailsModal rendering with user:', user);

  const userDetails = {
    ...user,
    fullName: user.fullName || user.name || 'Unknown User',
    email: user.email || 'No email provided',
    phone: user.phone || 'No phone provided',
    address: user.address || 'No address provided',
    joinDate: user.joinDate || '2024-01-01',
    profileImage: user.profileImage || user.avatar || null
  };

  const handleBackNavigation = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  const UserContent = () => (
    <div className="bg-white">
      {!isFullPage && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      )}
      
      <div className="p-6 max-w-6xl mx-auto">
        {isFullPage && (
          <div className="mb-6">
            <button
              onClick={handleBackNavigation}
              className="flex items-center text-amber-600 hover:text-amber-700 transition-colors font-semibold group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Previous Page
            </button>
          </div>
        )}

        {/* User Header Section - Simplified */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                {userDetails.profileImage ? (
                  <img
                    src={userDetails.profileImage}
                    alt={userDetails.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-12 h-12 text-amber-600" />
                )}
              </div>
              
              <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  {userDetails.fullName}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-amber-600" />
                    <span>{userDetails.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-amber-600" />
                    <span>{userDetails.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content - Simplified */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Contact Information</h2>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-medium text-gray-900">Email:</span>
                      <span className="ml-2 text-gray-700">{userDetails.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-medium text-gray-900">Phone:</span>
                      <span className="ml-2 text-gray-700">{userDetails.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-medium text-gray-900">Address:</span>
                      <span className="ml-2 text-gray-700">{userDetails.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information - Simplified */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Account Information</h2>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">Member Since:</span>
                    <span>{new Date(userDetails.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <UserContent />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative min-h-screen px-4 py-8">
        <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
          <UserContent />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
