import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, MapPin, Building, Star, Bed, Bath, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await axios.delete(`/favorites/${propertyId}`);
      toast.success('Removed from favorites');
      setFavorites(favorites.filter(fav => fav.property.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="page-header">
          <h1>My Favorites</h1>
          <p>Properties you've saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <Heart size={64} />
            <h2>No favorites yet</h2>
            <p>Save properties you like to easily find them later</p>
            <Link to="/properties" className="btn btn-primary">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="property-card">
                <div className="property-image">
                  {favorite.property?.images && favorite.property.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${favorite.property.images[0]}`} 
                      alt={favorite.property.title}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <Building size={48} />
                    </div>
                  )}
                  
                  <button 
                    className="favorite-btn active"
                    onClick={() => removeFavorite(favorite.property.id)}
                    title="Remove from favorites"
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
                
                <div className="property-info">
                  <div className="property-header">
                    <h3>
                      <Link to={`/properties/${favorite.property.id}`}>
                        {favorite.property.title}
                      </Link>
                    </h3>
                    
                    {favorite.property.reviews && favorite.property.reviews.length > 0 && (
                      <div className="rating">
                        <Star size={16} fill="currentColor" />
                        <span>{calculateAverageRating(favorite.property.reviews)}</span>
                        <span className="review-count">({favorite.property.reviews.length})</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="property-location">
                    <MapPin size={16} />
                    <span>{favorite.property.location}</span>
                  </div>
                  
                  <div className="property-features">
                    <div className="feature">
                      <Bed size={16} />
                      <span>{favorite.property.bedrooms} beds</span>
                    </div>
                    <div className="feature">
                      <Bath size={16} />
                      <span>{favorite.property.bathrooms} baths</span>
                    </div>
                    <div className="feature">
                      <span className="property-type">{favorite.property.type}</span>
                    </div>
                  </div>
                  
                  <div className="property-description">
                    <p>{favorite.property.description?.substring(0, 100)}...</p>
                  </div>
                  
                  <div className="property-amenities">
                    {favorite.property.amenities && favorite.property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {favorite.property.amenities && favorite.property.amenities.length > 3 && (
                      <span className="amenity-tag">+{favorite.property.amenities.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="property-footer">
                    <div className="property-price">
                      <span className="price">${favorite.property.price}</span>
                      <span className="period">/night</span>
                    </div>
                    
                    <div className="property-actions">
                      <Link 
                        to={`/properties/${favorite.property.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                      
                      <button 
                        onClick={() => removeFavorite(favorite.property.id)}
                        className="btn btn-outline btn-danger"
                        title="Remove from favorites"
                      >
                        <X size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="property-meta">
                    <small>Added to favorites: {new Date(favorite.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;