import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Star, Users, Bed, Bath } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('/properties?limit=6');
      setProperties(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/properties?location=${encodeURIComponent(searchTerm)}`;
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing properties for your next vacation or business trip</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="featured-properties">
        <div className="container">
          <h2>Featured Properties</h2>
          
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="property-card-skeleton"></div>
              ))}
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
          
          <div className="view-all">
            <Link to="/properties" className="btn btn-outline">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose HotelHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Search size={48} />
              <h3>Easy Search</h3>
              <p>Find the perfect property with our advanced search filters</p>
            </div>
            <div className="feature-card">
              <Star size={48} />
              <h3>Quality Assured</h3>
              <p>All properties are verified and reviewed by our community</p>
            </div>
            <div className="feature-card">
              <Users size={48} />
              <h3>24/7 Support</h3>
              <p>Our customer support team is always here to help you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;