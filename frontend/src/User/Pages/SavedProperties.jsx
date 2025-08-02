import React, { useState, useEffect } from 'react';
import { Bookmark, Home, X, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../Components/DashboardHeader';
import PropertyCard from '../Components/PropertyCard';
import Footer from '../Components/Footer';
import { propertiesAPI } from '../../services/api';

const SavedProperties = () => {
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Get saved property IDs from localStorage
  const getSavedPropertyIds = () => {
    const saved = localStorage.getItem('savedProperties');
    return saved ? JSON.parse(saved) : [];
  };

  // Save property IDs to localStorage
  const saveSavedPropertyIds = (ids) => {
    localStorage.setItem('savedProperties', JSON.stringify(ids));
  };

  // Fetch saved properties from localStorage and get property details
  const fetchSavedProperties = async () => {
    try {
      console.log('SavedProperties fetchSavedProperties called');
      setLoading(true);
      const savedIds = getSavedPropertyIds();
      console.log('SavedProperties retrieved savedIds from localStorage:', savedIds);
      setBookmarkedProperties(savedIds);
      console.log('SavedProperties set bookmarkedProperties to:', savedIds);
      
      if (savedIds.length > 0) {
        // Fetch property details for saved IDs
        const propertyPromises = savedIds.map(id => propertiesAPI.getProperty(id));
        const propertyResponses = await Promise.all(propertyPromises);
        const propertyDetails = propertyResponses
          .filter(response => response.success)
          .map(response => response.data);
        setProperties(propertyDetails);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      setProperties([]);
      setBookmarkedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a property from saved list
  const handleRemoveBookmark = (propertyId) => {
    console.log('SavedProperties handleRemoveBookmark called with propertyId:', propertyId);
    console.log('SavedProperties current bookmarkedProperties:', bookmarkedProperties);
    
    const updatedIds = bookmarkedProperties.filter(id => id !== propertyId);
    console.log('SavedProperties removing bookmark, updatedIds:', updatedIds);
    
    setBookmarkedProperties(updatedIds);
    saveSavedPropertyIds(updatedIds);
    setProperties(prev => prev.filter(property => property.id !== propertyId));
    
    // Verify localStorage was updated
    const savedInStorage = localStorage.getItem('savedProperties');
    console.log('SavedProperties saved to localStorage:', savedInStorage);
  };

  // Handle clearing all saved properties
  const handleClearAll = () => {
    setBookmarkedProperties([]);
    saveSavedPropertyIds([]);
    setProperties([]);
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);



  const toggleBookmark = handleRemoveBookmark;

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

  // Enhanced PropertyCardWithHover component - REMOVED X BUTTON
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
            showBookmarkButton={true} // Keep heart button visible for unsaving
            bookmarkedProperties={bookmarkedProperties}
            toggleBookmark={toggleBookmark} // This will handle unsaving when heart is clicked
            onViewDetails={() => handleViewDetails(property)} // Uses static routing
            className="group-hover:shadow-xl transition-all duration-300"
          />
          
          {/* Click indicator badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-medium text-gray-700">Click to view</span>
          </div>

          {/* Helper text for heart button */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-medium text-gray-700">💖 Click heart to unsave</span>
          </div>
        </div>
      </div>
    );
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
            {/* Added helper text */}
            <p className="text-sm text-gray-500 mt-2">
              💡 Click the heart icon on any property to remove it from your saved list
            </p>
          </div>
          
          {/* Clear All Button */}
          {bookmarkedPropertiesList.length > 0 && (
            <button
              onClick={handleClearAll}
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
              <PropertyCardWithHover
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SavedProperties;
