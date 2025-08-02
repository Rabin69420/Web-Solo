import React, { useState } from 'react';
import {
  X,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Users,
  Phone,
  Mail,
  User,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../../services/api';

const PropertyDetailsModal = ({ 
  isOpen, 
  property, 
  onClose,
  isFullPage = false 
}) => {
  const navigate = useNavigate();
  
  // Sample reviews data - admin can only view, not add
  const [reviews] = useState([
    {
      id: 1,
      reviewer: "John Smith",
      comment: "Amazing property with stunning ocean views! The host was very responsive and the place was exactly as described.",
      date: "2024-01-15"
    },
    {
      id: 2,
      reviewer: "Emily Chen",
      comment: "Beautiful location and well-maintained property. The infinity pool was a highlight of our stay.",
      date: "2024-01-10"
    },
    {
      id: 3,
      reviewer: "Michael Rodriguez",
      comment: "Perfect for a long-term stay. Very comfortable and all amenities worked perfectly.",
      date: "2024-01-05"
    }
  ]);

  if (!isOpen || !property) return null;

  // Extended property data for details view
  const propertyDetails = {
    ...property,
    bedrooms: property.bedrooms || 4,
    bathrooms: property.bathrooms || 3,
    maxOccupants: property.maxOccupancy || 6,
    description: property.description || "Escape to this stunning oceanfront paradise where luxury meets comfort. This exquisite villa offers breathtaking panoramic views of the Pacific Ocean, featuring an infinity pool that seems to merge with the horizon. The spacious interior boasts contemporary design with floor-to-ceiling windows, allowing natural light to flood every room.",
    rules: property.houseRules || [
      'No smoking inside the property',
      'No pets allowed',
      'Quiet hours: 10 PM - 8 AM',
      `Maximum ${property.maxOccupancy || 6} occupants allowed`,
      'Minimum 3-month rental required',
      'Security deposit required'
    ],
    host: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@renteasy.com'
    },
    images: [
      ...(property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800']),
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ]
  };

  // Handle back navigation - goes to previous page
  const handleBackNavigation = () => {
    if (onClose) {
      onClose(); // This will use navigate(-1) or admin-specific navigation
    } else {
      window.history.back(); // Fallback
    }
  };

  // Static routing navigation (for future admin implementation)
  const handleViewDetails = () => {
    // Navigate to admin property details page
    navigate('/admin/viewdetails', { 
      state: { 
        property: propertyDetails
      } 
    });
  };

  // Content component
  const PropertyContent = () => (
    <div className="bg-white">
      {/* Close button only for modal mode */}
      {!isFullPage && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      )}
      
      <div className="p-6 max-w-6xl mx-auto">
        {/* Back Button - Only for full page mode */}
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

        {/* Property Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-3">
                {propertyDetails.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                <span className="text-lg">{propertyDetails.location}</span>
              </div>
              {/* Status Badge */}
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  propertyDetails.status === 'Available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {propertyDetails.status || 'Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Image Gallery - Fixed height to prevent content hiding */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main image */}
            <div className="md:col-span-3">
              <img
                src={propertyDetails.images && propertyDetails.images[0] ? `${IMAGE_BASE_URL}${propertyDetails.images[0]}` : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300'}
                alt={propertyDetails.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>
            {/* Thumbnail images */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
              {propertyDetails.images && propertyDetails.images.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={`${IMAGE_BASE_URL}${image}`}
                  alt={`Property view ${index + 2}`}
                  className="w-full h-20 md:h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl">
              <div className="text-center">
                <Bed className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{propertyDetails.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <Bath className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{propertyDetails.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{propertyDetails.maxOccupants}</div>
                <div className="text-sm text-gray-600">Max Occupants</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {propertyDetails.description}
              </p>
            </div>

            {/* House Rules */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">House Rules</h2>
              <ul className="space-y-3">
                {propertyDetails.rules.map((rule, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>


          </div>

          {/* Price Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
              {/* Price Section */}
              <div className="text-center">
                <div className="flex items-center justify-center text-3xl font-bold text-slate-900 mb-2">
                  <DollarSign className="w-8 h-8 mr-1" />
                  {propertyDetails.price?.toLocaleString()}
                  <span className="text-lg text-gray-500 ml-2">/month</span>
                </div>
                <p className="text-gray-600">Monthly rental rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Admin View Only (Read-Only) */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Guest Reviews</h2>
            
            {/* Reviews List - No Add Comment Option for Admin */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet for this property.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <User className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{review.reviewer}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return different wrappers based on mode
  if (isFullPage) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <PropertyContent />
      </div>
    );
  }

  // Modal mode
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative min-h-screen px-4 py-8">
        <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
          <PropertyContent />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
