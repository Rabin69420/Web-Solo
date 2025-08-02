import React from 'react';
import { Heart, HeartOff, MapPin, DollarSign, Home, Building, Users, Bed } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../services/api';

const PropertyCard = ({ 
  property, 
  showBookmarkButton = true, 
  bookmarkedProperties, 
  toggleBookmark,
  onViewDetails
}) => {
  const getAccommodationIcon = (type) => {
    switch(type) {
      case 'whole_house': return <Home className="w-4 h-4" />;
      case 'whole_apartment': 
      case 'whole_flat': return <Building className="w-4 h-4" />;
      case 'single_room': 
      case 'multiple_rooms': return <Bed className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const getAccommodationLabel = (property) => {
    switch(property.accommodationType) {
      case 'whole_house': return 'Entire House';
      case 'whole_apartment': return 'Entire Apartment';
      case 'whole_flat': return 'Entire Flat';
      case 'single_room': return 'Single Room';
      case 'multiple_rooms': return `${property.minRooms}-${property.maxRooms} Rooms`;
      default: return 'Property';
    }
  };

  const getPriceDisplay = (property) => {
    if (property.accommodationType === 'multiple_rooms') {
      return (
        <div className="flex flex-col">
          <div className="flex items-center text-orange-600 font-bold text-2xl">
            <DollarSign className="w-6 h-6 mr-1" />
            {property.pricePerRoom.toLocaleString()}
            <span className="text-sm text-gray-500 ml-2">/room/month</span>
          </div>
          <span className="text-sm text-gray-600">
            From ${(property.pricePerRoom * property.minRooms).toLocaleString()}/month total
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-orange-600 font-bold text-3xl">
        <DollarSign className="w-7 h-7 mr-1" />
        {property.price.toLocaleString()}
        <span className="text-base text-gray-500 ml-2">/month</span>
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative overflow-hidden cursor-pointer" onClick={onViewDetails}>
        <img 
          src={property.images && property.images[0] ? `${IMAGE_BASE_URL}${property.images[0]}` : property.image} 
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Accommodation Type Badge */}
        <div className="absolute top-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold shadow-lg">
          {getAccommodationIcon(property.accommodationType)}
          <span className="ml-2 text-slate-700">{getAccommodationLabel(property)}</span>
        </div>

        {showBookmarkButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(property.id);
            }}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg"
          >
            {bookmarkedProperties.includes(property.id) ? (
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            ) : (
              <HeartOff className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}
        
        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-slate-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            View Details
          </div>
        </div>
      </div>
      
      <div className="p-8 cursor-pointer" onClick={onViewDetails}>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-5 h-5 mr-2 text-orange-500" />
          <span className="text-base">{property.location}</span>
        </div>
        
        {getPriceDisplay(property)}

        {/* Occupancy Info */}
        <div className="flex items-center text-gray-600 mt-3">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Up to {property.maxOccupancy} {property.maxOccupancy === 1 ? 'person' : 'people'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
