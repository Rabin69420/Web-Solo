import React, { useState, useEffect } from 'react';
import { ArrowRight, Home, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../Components/DashboardHeader';
import PropertyCard from '../Components/PropertyCard';
import PropertyDetails from '../Components/PropertyDetails';
import Footer from '../Components/Footer';

const Overview = () => {
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Enhanced property data with availability status
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
      maxOccupancy: 10,
      availableRooms: null
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
      maxOccupancy: 4,
      availableRooms: null
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
      maxOccupancy: 6,
      availableRooms: null
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
      maxOccupancy: 12,
      availableRooms: null
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
      maxOccupancy: 2,
      availableRooms: null
    },
    {
      id: 7,
      title: 'Spacious Room in Student Housing',
      location: 'Boston, Massachusetts',
      price: 950,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      isFeatured: false,
      isAvailable: false,
      accommodationType: 'single_room',
      propertyType: 'Student Housing',
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 1,
      availableRooms: 2,
      totalRooms: 8
    },
    {
      id: 8,
      title: 'Penthouse Flat with City Views',
      location: 'Sydney, Australia',
      price: 5200,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'whole_flat',
      propertyType: 'Penthouse',
      bedrooms: 4,
      bathrooms: 3,
      maxOccupancy: 8,
      availableRooms: null
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

  const featuredProperties = properties.filter(property => property.isFeatured);
  const bookmarkedPropertiesList = properties.filter(property =>
    bookmarkedProperties.includes(property.id)
  );

  console.log('Featured Properties:', featuredProperties); // Debug
  console.log('All Properties:', properties); // Debug

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader currentPage="overview" bookmarkedCount={bookmarkedProperties.length} />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-200"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-400"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              Discover
              <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Extraordinary
              </span>
              Rentals
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              From luxury villas and modern apartments to cozy single rooms,
              find the perfect accommodation for your lifestyle and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {/* Accommodation Types Showcase - Moved to First Position */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                Choose Your Perfect Stay
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Whether you need privacy, community, or flexibility, we have accommodation options to suit every preference
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Whole Houses */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Entire Houses</h3>
                <p className="text-gray-600 text-sm mb-3">Complete privacy with full house rentals</p>
                <div className="text-2xl font-bold text-amber-600">
                  {properties.filter(p => p.accommodationType === 'whole_house').length} available
                </div>
              </div>

              {/* Apartments & Flats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Flats & Apartments</h3>
                <p className="text-gray-600 text-sm mb-3">Modern urban living spaces</p>
                <div className="text-2xl font-bold text-blue-600">
                  {properties.filter(p => p.accommodationType === 'whole_apartment' || p.accommodationType === 'whole_flat').length} available
                </div>
              </div>

              {/* Single Rooms */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Single Rooms</h3>
                <p className="text-gray-600 text-sm mb-3">Affordable private rooms in shared spaces</p>
                <div className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.accommodationType === 'single_room').length} available
                </div>
              </div>
            </div>
          </div>

          {/* Featured Listings Section - Now Second Position */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  Featured Listings
                </h2>
                <p className="text-xl text-slate-600">
                  Our most exceptional and sought-after properties across all accommodation types
                </p>
              </div>
              <Link
                to="/browse"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-semibold shadow-lg"
              >
                View All
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            {featuredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.slice(0, 3).map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    bookmarkedProperties={bookmarkedProperties}
                    toggleBookmark={toggleBookmark}
                    onViewDetails={() => handleViewDetails(property)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No featured properties available</p>
              </div>
            )}
          </div>

          {/* All Properties Preview - Limited to 4 */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  Explore All Accommodations
                </h2>
                <p className="text-xl text-slate-600">
                  Browse houses, flats, apartments, and single rooms
                </p>
              </div>
              <Link
                to="/browse"
                className="flex items-center px-6 py-3 bg-white border-2 border-amber-600 text-amber-700 rounded-full hover:bg-amber-50 transition-all duration-200 font-semibold shadow-lg"
              >
                Browse All
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.slice(0, 4).map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    bookmarkedProperties={bookmarkedProperties}
                    toggleBookmark={toggleBookmark}
                    onViewDetails={() => handleViewDetails(property)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No properties available</p>
              </div>
            )}
          </div>

          {/* Saved Properties Section */}
          {bookmarkedProperties.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                    Your Saved Properties
                  </h2>
                  <p className="text-xl text-slate-600">
                    Properties you've bookmarked for later
                  </p>
                </div>
                <Link
                  to="/saved"
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 font-semibold shadow-lg"
                >
                  View Saved
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookmarkedPropertiesList.slice(0, 3).map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    showBookmarkButton={false}
                    bookmarkedProperties={bookmarkedProperties}
                    toggleBookmark={toggleBookmark}
                    onViewDetails={() => handleViewDetails(property)}
                  />
                ))}
              </div>
            </div>
          )}

          {bookmarkedProperties.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Start Saving Properties</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                Browse our diverse accommodation options and save your favorites by clicking the heart icon.
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-semibold text-lg shadow-lg"
              >
                <Home className="w-5 h-5 mr-3" />
                Explore All Accommodations
              </Link>
            </div>
          )}
        </div>
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

export default Overview;
