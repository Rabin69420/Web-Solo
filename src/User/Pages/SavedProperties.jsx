import React, { useState } from 'react';
import { Bookmark, Home, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../Components/DashboardHeader';
import PropertyCard from '../Components/PropertyCard';
import PropertyDetails from '../Components/PropertyDetails';
import Footer from '../Components/Footer';

const SavedProperties = () => {
  // Mock bookmarked properties - simulating user has already saved some
  const [bookmarkedProperties, setBookmarkedProperties] = useState([1, 3, 5, 7, 9]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Enhanced property data with different accommodation types
  const [properties] = useState([
    {
      id: 1,
      title: 'Villa Serenity - Oceanfront Paradise',
      location: 'Malibu, California',
      price: 12500,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      isFeatured: true,
      isAvailable: true,
      accommodationType: 'whole_house',
      propertyType: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      maxOccupancy: 10
    },
    {
      id: 2,
      title: 'Downtown Modern Apartment',
      location: 'Manhattan, New York',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      isFeatured: true,
      isAvailable: false,
      accommodationType: 'whole_apartment',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      maxOccupancy: 4
    },
    {
      id: 3,
      title: 'Luxury Flat in Historic Building',
      location: 'London, UK',
      price: 3800,
      image: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'whole_flat',
      propertyType: 'Flat',
      bedrooms: 3,
      bathrooms: 2,
      maxOccupancy: 6
    },
    {
      id: 4,
      title: 'Cozy Room in Shared House',
      location: 'San Francisco, California',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'single_room',
      propertyType: 'Shared House',
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2,
      availableRooms: 1,
      totalRooms: 5
    },
    {
      id: 5,
      title: 'Tuscan Countryside Villa',
      location: 'Florence, Italy',
      price: 9200,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      isFeatured: true,
      isAvailable: false,
      accommodationType: 'whole_house',
      propertyType: 'Villa',
      bedrooms: 6,
      bathrooms: 5,
      maxOccupancy: 12
    },
    {
      id: 6,
      title: 'Modern Studio Apartment',
      location: 'Tokyo, Japan',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      isFeatured: true,
      isAvailable: true,
      accommodationType: 'whole_apartment',
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2
    },
    {
      id: 7,
      title: 'Charming Seaside Cottage',
      location: 'Cornwall, England',
      price: 4200,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'whole_house',
      propertyType: 'Cottage',
      bedrooms: 3,
      bathrooms: 2,
      maxOccupancy: 6
    },
    {
      id: 8,
      title: 'Urban Loft in Arts District',
      location: 'Berlin, Germany',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      isFeatured: false,
      isAvailable: false,
      accommodationType: 'whole_apartment',
      propertyType: 'Loft',
      bedrooms: 2,
      bathrooms: 1,
      maxOccupancy: 4
    },
    {
      id: 9,
      title: 'Mountain Retreat Cabin',
      location: 'Swiss Alps, Switzerland',
      price: 5800,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'whole_house',
      propertyType: 'Cabin',
      bedrooms: 4,
      bathrooms: 3,
      maxOccupancy: 8
    },
    {
      id: 10,
      title: 'Private Room in Student Hub',
      location: 'Barcelona, Spain',
      price: 950,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'single_room',
      propertyType: 'Student Housing',
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2,
      availableRooms: 2,
      totalRooms: 6
    }
  ]);

  const toggleBookmark = (propertyId) => {
    setBookmarkedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedProperty(null);
  };

  const removeFromSaved = (propertyId) => {
    setBookmarkedProperties(prev => prev.filter(id => id !== propertyId));
  };

  const bookmarkedPropertiesList = properties.filter(property =>
    bookmarkedProperties.includes(property.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader currentPage="saved" bookmarkedCount={bookmarkedProperties.length} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
              Your Saved Properties
            </h2>
            <p className="text-xl text-slate-600">
              {bookmarkedPropertiesList.length} properties you've bookmarked
            </p>
          </div>
          
          {/* Clear All Button */}
          {bookmarkedPropertiesList.length > 0 && (
            <button
              onClick={() => setBookmarkedProperties([])}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>
        
        {bookmarkedPropertiesList.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <Bookmark className="w-16 h-16 text-amber-600" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">No saved properties yet</h3>
            <p className="text-xl text-slate-600 mb-10 max-w-md mx-auto">
              Start exploring our exceptional properties and save your favorites by clicking the heart icon.
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-semibold text-lg shadow-lg"
            >
              <Home className="w-5 h-5 mr-3" />
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {bookmarkedPropertiesList.map(property => (
              <div key={property.id} className="relative">
                <PropertyCard 
                  property={property} 
                  showBookmarkButton={true}
                  bookmarkedProperties={bookmarkedProperties}
                  toggleBookmark={toggleBookmark}
                  onViewDetails={() => handleViewDetails(property)}
                />
                
                {/* Remove from Saved Button */}
                <button
                  onClick={() => removeFromSaved(property.id)}
                  className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                  title="Remove from saved"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        bookmarkedProperties={bookmarkedProperties}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
};

export default SavedProperties;
