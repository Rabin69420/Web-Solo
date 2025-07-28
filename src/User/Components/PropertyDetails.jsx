import React from 'react';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Users, 
  Star,
  Heart,
  HeartOff,
  Phone,
  Mail,
  Shield
} from 'lucide-react';

const PropertyDetails = ({ 
  property, 
  isOpen, 
  onClose, 
  bookmarkedProperties, 
  toggleBookmark 
}) => {
  if (!isOpen || !property) return null;

  // Extended property data for details view
  const propertyDetails = {
    ...property,
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    rating: 4.8,
    reviews: 124,
    isAvailable: true, // Property availability status
    minRentalDuration: 3, // Minimum months for rental
    maxOccupants: 6, // Maximum allowed occupants
    description: "Escape to this stunning oceanfront paradise where luxury meets comfort. This exquisite villa offers breathtaking panoramic views of the Pacific Ocean, featuring an infinity pool that seems to merge with the horizon. The spacious interior boasts contemporary design with floor-to-ceiling windows, allowing natural light to flood every room.",
    rules: [
      'No smoking inside the property',
      'No pets allowed',
      'Quiet hours: 10 PM - 8 AM',
      'Maximum 6 occupants allowed',
      'Minimum 3-month rental required',
      'Security deposit required'
    ],
    host: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@renteasy.com'
    },
    images: [
      property.image,
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ]
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Transparent backdrop that doesn't turn black */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal content - Fixed scrolling and positioning */}
      <div className="relative min-h-screen px-4 py-8">
        <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
          {/* Header */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Image Gallery - Fixed height to prevent overflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-64 md:h-80">
              <div className="md:col-span-2">
                <img
                  src={propertyDetails.images[0]}
                  alt={propertyDetails.title}
                  className="w-full h-full object-cover rounded-tl-3xl md:rounded-bl-3xl"
                />
              </div>
              <div className="hidden md:grid grid-rows-2 gap-2">
                <img
                  src={propertyDetails.images[1]}
                  alt="Property view 2"
                  className="w-full h-full object-cover rounded-tr-3xl"
                />
                <div className="relative">
                  <img
                    src={propertyDetails.images[2]}
                    alt="Property view 3"
                    className="w-full h-full object-cover rounded-br-3xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-br-3xl flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{propertyDetails.images.length - 3} more photos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title and Basic Info */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                        {propertyDetails.title}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                        <span className="text-lg">{propertyDetails.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(propertyDetails.id)}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                    >
                      {bookmarkedProperties.includes(propertyDetails.id) ? (
                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                      ) : (
                        <HeartOff className="w-6 h-6 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Rating and Reviews - Removed Availability */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center bg-amber-50 px-3 py-2 rounded-full">
                      <Star className="w-5 h-5 text-amber-500 fill-current mr-1" />
                      <span className="font-semibold text-amber-700">{propertyDetails.rating}</span>
                    </div>
                    <span className="text-gray-600">({propertyDetails.reviews} reviews)</span>
                    <div className="flex items-center text-green-600">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Verified Property</span>
                    </div>
                  </div>

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
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">About this property</h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
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

                {/* Host Information - Simplified */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Meet your host</h2>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-900">{propertyDetails.host.name}</h3>
                      
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Phone className="w-4 h-4 text-amber-600" />
                        <span className="text-base">{propertyDetails.host.phone}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Mail className="w-4 h-4 text-amber-600" />
                        <span className="text-base">{propertyDetails.host.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-8 bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                  {/* Price Section with Bookmark */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center text-3xl font-bold text-slate-900 mb-2">
                        <DollarSign className="w-8 h-8 mr-1" />
                        {propertyDetails.price.toLocaleString()}
                        <span className="text-lg text-gray-500 ml-2">/month</span>
                      </div>
                      <p className="text-gray-600">Monthly rental rate</p>
                    </div>
                    
                    {/* Bookmark Button in Sidebar */}
                    <button
                      onClick={() => toggleBookmark(propertyDetails.id)}
                      className="ml-4 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md"
                      title={bookmarkedProperties.includes(propertyDetails.id) ? "Remove from bookmarks" : "Add to bookmarks"}
                    >
                      {bookmarkedProperties.includes(propertyDetails.id) ? (
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      ) : (
                        <HeartOff className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Rental Information */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rental Duration</label>
                      <div className="p-3 border border-gray-300 rounded-xl bg-gray-50">
                        <span className="text-gray-700 font-medium">
                          {propertyDetails.minRentalDuration} months minimum
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Occupants</label>
                      <div className="p-3 border border-gray-300 rounded-xl bg-gray-50">
                        <span className="text-gray-700 font-medium">
                          Up to {propertyDetails.maxOccupants} people
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Monthly rent</span>
                      <span>${propertyDetails.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Security deposit</span>
                      <span>${(propertyDetails.price * 0.5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Application fee</span>
                      <span>$100</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-900 pt-3 border-t border-gray-200">
                      <span>Move-in cost</span>
                      <span>${(propertyDetails.price + (propertyDetails.price * 0.5) + 100).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      *Security deposit refundable upon lease completion
                    </div>
                  </div>

                  {/* Contact Host Button */}
                  <button 
                    className="w-full font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    Contact the Host to Book the Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
