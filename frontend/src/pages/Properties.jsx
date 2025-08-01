import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Star, Users, Bed, Bath, Filter, Building } from 'lucide-react';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    type: '',
    available: 'true'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      // Add search params from URL
      searchParams.forEach((value, key) => {
        if (!queryParams.has(key)) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`/properties?${queryParams.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.append(key, value);
      }
    });
    
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      type: '',
      available: 'true'
    });
    setSearchParams({});
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="properties-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Your Perfect Stay</h1>
          <p>Browse through our collection of amazing properties</p>
        </div>

        <div className="search-filters">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-row">
              <div className="search-input-group">
                <Search className="search-icon" />
                <input
                  type="text"
                  name="location"
                  placeholder="Search by location..."
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="search-input"
                />
              </div>
              <button 
                type="button" 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filters
              </button>
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>

            {showFilters && (
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="$0"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="$1000"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Bedrooms</label>
                  <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Property Type</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                <div className="filter-actions">
                  <button type="button" onClick={clearFilters} className="btn btn-outline">
                    Clear
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="results-info">
          <p>{properties.length} properties found</p>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="property-card-skeleton"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="no-results">
            <Building size={64} />
            <h3>No properties found</h3>
            <p>Try adjusting your search criteria</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <Link 
                key={property.id} 
                to={`/properties/${property.id}`} 
                className="property-card"
              >
                <div className="property-image">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${property.images[0]}`} 
                      alt={property.title}
                      onError={(e) => {
                        e.target.src = '/placeholder-property.jpg';
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <Building size={48} />
                    </div>
                  )}
                  <div className="property-price">
                    ${property.price}/night
                  </div>
                  {!property.available && (
                    <div className="unavailable-badge">
                      Unavailable
                    </div>
                  )}
                </div>
                
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <div className="property-location">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="property-features">
                    <div className="feature">
                      <Bed size={16} />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="feature">
                      <Bath size={16} />
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="feature">
                      <Users size={16} />
                      <span>{property.type}</span>
                    </div>
                  </div>
                  
                  {property.reviews && property.reviews.length > 0 && (
                    <div className="property-rating">
                      <Star size={16} className="star-filled" />
                      <span>{calculateAverageRating(property.reviews)}</span>
                      <span className="review-count">({property.reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;