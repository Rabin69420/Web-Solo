import React, { useState, useEffect } from 'react';
import { ArrowRight, Home, Bookmark, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../Components/DashboardHeader';
import PropertyCard from '../Components/PropertyCard';
import Footer from '../Components/Footer';
import { propertiesAPI } from '../../services/api';

const Overview = () => {
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Navigation hook for static routing

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getProperties();
      if (response.success && response.data.properties) {
        setProperties(response.data.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Get saved property IDs from localStorage
  const getSavedPropertyIds = () => {
    const saved = localStorage.getItem('savedProperties');
    return saved ? JSON.parse(saved) : [];
  };

  // Save property IDs to localStorage
  const saveSavedPropertyIds = (ids) => {
    localStorage.setItem('savedProperties', JSON.stringify(ids));
  };

  // Fetch saved properties from localStorage
  const fetchSavedProperties = () => {
    console.log('Overview fetchSavedProperties called');
    const savedIds = getSavedPropertyIds();
    console.log('Overview retrieved savedIds from localStorage:', savedIds);
    setBookmarkedProperties(savedIds);
    console.log('Overview set bookmarkedProperties to:', savedIds);
  };

  // Handle bookmark toggle
  const handleBookmark = (propertyId) => {
    console.log('Overview handleBookmark called with propertyId:', propertyId);
    console.log('Overview current bookmarkedProperties:', bookmarkedProperties);
    
    const isCurrentlySaved = bookmarkedProperties.includes(propertyId);
    let updatedIds;
    
    if (isCurrentlySaved) {
      updatedIds = bookmarkedProperties.filter(id => id !== propertyId);
      console.log('Overview removing bookmark, updatedIds:', updatedIds);
    } else {
      updatedIds = [...bookmarkedProperties, propertyId];
      console.log('Overview adding bookmark, updatedIds:', updatedIds);
    }
    
    setBookmarkedProperties(updatedIds);
    saveSavedPropertyIds(updatedIds);
    
    // Verify localStorage was updated
    const savedInStorage = localStorage.getItem('savedProperties');
    console.log('Overview saved to localStorage:', savedInStorage);
  };

  useEffect(() => {
    fetchProperties();
    fetchSavedProperties();
  }, []);



  const toggleBookmark = handleBookmark;

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

  // Enhanced PropertyCardWithHover component
  const PropertyCardWithHover = ({ property, showBookmarkButton = true, className = "" }) => {
    return (
      <div
        className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
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
            showBookmarkButton={showBookmarkButton}
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

  const featuredProperties = properties.filter(property => property.isFeatured);
  const bookmarkedPropertiesList = properties.filter(property =>
    bookmarkedProperties.includes(property.id)
  );

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

          {/* Interactive Hint - Updated text for static routing */}
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 inline-flex items-center shadow-lg border border-amber-200">
            <Eye className="w-5 h-5 text-amber-600 mr-2" />
            <span className="text-amber-800 font-medium">Click any property card to view full details page</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {/* Accommodation Types Showcase */}
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

          {/* Featured Listings Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  Featured Listings
                </h2>
                <p className="text-xl text-slate-600">
                  Our most exceptional and sought-after properties - click to explore details
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
                  <PropertyCardWithHover
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No featured properties available</p>
              </div>
            )}
          </div>

          {/* All Properties Preview */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                  Explore All Accommodations
                </h2>
                <p className="text-xl text-slate-600">
                  Browse houses, flats, apartments, and single rooms - click any card for details
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
                  <PropertyCardWithHover
                    key={property.id}
                    property={property}
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
                    Properties you've bookmarked - click to view details
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
                  <PropertyCardWithHover
                    key={property.id}
                    property={property}
                    showBookmarkButton={false}
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
    </div>
  );
};

export default Overview;
