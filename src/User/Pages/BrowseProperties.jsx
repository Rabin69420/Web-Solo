import React, { useState } from 'react';
import { Search, Filter, X, Home, Building, Bed, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../Components/DashboardHeader';
import PropertyCard from '../Components/PropertyCard';
import Footer from '../Components/Footer';

const BrowseProperties = () => {
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  // Removed selectedProperty and isDetailsOpen - no longer using modal
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [availability, setAvailability] = useState('all');

  const navigate = useNavigate(); // Add navigation hook for static routing

  // Enhanced property data with different accommodation types and availability
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
      maxOccupancy: 8
    },
    {
      id: 9,
      title: 'Charming House in Countryside',
      location: 'Cotswolds, England',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'whole_house',
      propertyType: 'Country House',
      bedrooms: 4,
      bathrooms: 3,
      maxOccupancy: 8
    },
    {
      id: 10,
      title: 'Private Room in City Center',
      location: 'Barcelona, Spain',
      price: 1100,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      isFeatured: false,
      isAvailable: true,
      accommodationType: 'single_room',
      propertyType: 'Shared Apartment',
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2,
      availableRooms: 1,
      totalRooms: 3
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

  // STATIC ROUTING: Navigate to /viewdetails (no dynamic ID)
  const handleViewDetails = (property) => {
    console.log('Navigating to details for:', property);
    // Navigate to STATIC route '/viewdetails' and pass property data via state
    navigate('/viewdetails', { 
      state: { 
        property: property,
        bookmarkedProperties: bookmarkedProperties 
      } 
    });
  };

  // Remove closeDetails function since we're not using modal

  // Enhanced PropertyCardWithHover component
  const PropertyCardWithHover = ({ property }) => {
    return (
      <div
        className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        onMouseEnter={() => setHoveredCard(property.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleViewDetails(property)} // Uses static routing
      >
        {/* Hover Overlay with "View Details" */}
        <div 
          className={`absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            hoveredCard === property.id ? 'backdrop-blur-sm' : ''
          }`}
        >
          <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <span className="text-lg font-semibold">View Details</span>
            <p className="text-sm opacity-90 mt-1">Click to explore</p>
          </div>
        </div>

        {/* Enhanced PropertyCard with better hover states */}
        <div className="relative">
          <PropertyCard 
            property={property} 
            bookmarkedProperties={bookmarkedProperties}
            toggleBookmark={toggleBookmark}
            onViewDetails={() => handleViewDetails(property)} // Uses static routing
            className="group-hover:shadow-xl transition-all duration-300"
          />
          
          {/* Click indicator badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-medium text-gray-700">Click to view</span>
          </div>
        </div>
      </div>
    );
  };

  // Filter properties based on selected filters
  const filteredProperties = properties.filter(property => {
    // Accommodation type filter
    if (activeFilter !== 'all' && property.accommodationType !== activeFilter) {
      return false;
    }

    // Price range filter
    if (priceRange !== 'all') {
      if (priceRange === 'under2000' && property.price >= 2000) return false;
      if (priceRange === '2000-5000' && (property.price < 2000 || property.price > 5000)) return false;
      if (priceRange === '5000-10000' && (property.price < 5000 || property.price > 10000)) return false;
      if (priceRange === 'over10000' && property.price <= 10000) return false;
    }

    // Availability filter
    if (availability !== 'all') {
      if (availability === 'available' && !property.isAvailable) return false;
      if (availability === 'unavailable' && property.isAvailable) return false;
    }

    return true;
  });

  const accommodationFilters = [
    { key: 'all', label: 'All Properties', icon: Filter, count: properties.length },
    { 
      key: 'whole_house', 
      label: 'Entire Houses', 
      icon: Home, 
      count: properties.filter(p => p.accommodationType === 'whole_house').length 
    },
    { 
      key: 'whole_apartment', 
      label: 'Apartments', 
      icon: Building, 
      count: properties.filter(p => p.accommodationType === 'whole_apartment').length 
    },
    { 
      key: 'whole_flat', 
      label: 'Flats', 
      icon: Building, 
      count: properties.filter(p => p.accommodationType === 'whole_flat').length 
    },
    { 
      key: 'single_room', 
      label: 'Single Rooms', 
      icon: Bed, 
      count: properties.filter(p => p.accommodationType === 'single_room').length 
    }
  ];

  const clearAllFilters = () => {
    setActiveFilter('all');
    setPriceRange('all');
    setAvailability('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader currentPage="browse" bookmarkedCount={bookmarkedProperties.length} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
              Browse All Properties
            </h2>
            <p className="text-xl text-slate-600">
              {filteredProperties.length} of {properties.length} properties match your criteria
            </p>
          </div>
          
          {/* Clear Filters Button */}
          {(activeFilter !== 'all' || priceRange !== 'all' || availability !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          {/* Accommodation Type Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Accommodation Type</h3>
            <div className="flex flex-wrap gap-3">
              {accommodationFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      activeFilter === filter.key
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-2 ${
                      activeFilter === filter.key ? 'text-amber-600' : 'text-gray-600'
                    }`} />
                    <span className="font-medium text-sm">
                      {filter.label} ({filter.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range Filter */}
            <div>
              <h4 className="text-base font-semibold text-slate-900 mb-3">Price Range (per month)</h4>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">All Prices</option>
                <option value="under2000">Under $2,000</option>
                <option value="2000-5000">$2,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="over10000">Over $10,000</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <h4 className="text-base font-semibold text-slate-900 mb-3">Availability</h4>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">All Properties</option>
                <option value="available">Available Now</option>
                <option value="unavailable">Currently Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map(property => (
              <PropertyCardWithHover
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">No properties found</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              No properties match your current filter criteria. Try adjusting your filters to see more results.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-semibold text-lg shadow-lg"
            >
              <X className="w-5 h-5 mr-3" />
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Removed PropertyDetails modal - no longer needed */}
    </div>
  );
};

export default BrowseProperties;
