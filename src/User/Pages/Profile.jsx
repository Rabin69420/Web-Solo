import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import DashboardHeader from '../Components/DashboardHeader';


const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Updated user profile state with User name and random details
  const [profileData, setProfileData] = useState({
    firstName: 'User',
    lastName: '',
    email: 'user@example.com',
    phone: '+1 (234) 567-8901',
    address: '456 Random St, Cityville, TX 78901',
    bio: 'Hello! I am a regular user who enjoys finding great rental properties around the globe.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log('Saving profile data:', profileData);
    if (showPasswordFields) {
      console.log('Updating password');
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordFields(false);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset any changes (you might want to keep original data in a separate state)
    setIsEditing(false);
    setShowPasswordFields(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader currentPage="profile" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* User Info - Simplified without premium status and join date */}
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl font-serif font-bold mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-white/90 text-lg mb-2">{profileData.email}</p>
              </div>

              {/* Edit Button */}
              <div className="md:ml-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-3 bg-white text-orange-600 rounded-full hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 font-semibold shadow-lg"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Personal Information</h2>
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-700">
                      {profileData.firstName}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-700">
                      {profileData.lastName || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 text-amber-600 mr-2" />
                      {profileData.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 text-amber-600 mr-2" />
                      {profileData.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Bio */}
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Contact & Bio</h2>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-700 flex items-start">
                      <MapPin className="w-4 h-4 text-amber-600 mr-2 mt-0.5" />
                      {profileData.address}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-700">
                      {profileData.bio}
                    </div>
                  )}
                </div>

                {/* Password Section */}
                {isEditing && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
                      <button
                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        {showPasswordFields ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>

                    {showPasswordFields && (
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                              className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                              className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                              className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
