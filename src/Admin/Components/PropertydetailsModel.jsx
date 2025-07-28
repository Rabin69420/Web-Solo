import React from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Users
} from 'lucide-react';

const PropertyDetailsModal = ({ isOpen, property, onClose }) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">
              Property Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image */}
            <div className="w-full h-60 bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={property.image || property.images?.[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Status */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {property.title}
              </h3>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  property.status === 'Available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {property.status}
              </span>
            </div>

            {/* Location */}
            <p className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              {property.location}
            </p>

            {/* Details */}
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-1">
                <Bed className="w-5 h-5 text-gray-500" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-5 h-5 text-gray-500" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-5 h-5 text-gray-500" />
                <span>{property.maxOccupancy} Guests</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg font-medium mb-2">Description</h4>
              <p className="text-gray-700">{property.description}</p>
            </div>

            {/* House Rules */}
            <div>
              <h4 className="text-lg font-medium mb-2">House Rules</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {property.houseRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-lg font-medium mb-2">Price</h4>
              <p className="text-2xl font-bold text-orange-600">
                ${property.price}/month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
