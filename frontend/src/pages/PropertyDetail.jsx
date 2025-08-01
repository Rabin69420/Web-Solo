import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  MapPin, Star, Users, Bed, Bath, Wifi, Car, 
  Coffee, Tv, Heart, Calendar, ArrowLeft 
} from 'lucide-react';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchProperty();
    if (user && user.role === 'user') {
      checkFavoriteStatus();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/properties/${id}`);
      setProperty(response.data);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`/favorites/check/${id}`);
      setIsFavorite(response.data.isFavorite);
      setFavoriteId(response.data.favoriteId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || user.role !== 'user') {
      toast.error('Please login as a user to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/favorites/${favoriteId}`);
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success('Removed from favorites');
      } else {
        const response = await axios.post('/favorites', { propertyId: id });
        setIsFavorite(true);
        setFavoriteId(response.data.favorite.id);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'user') {
      toast.error('Please login as a user to make bookings');
      return;
    }

    setBookingLoading(true);
    
    try {
      await axios.post('/bookings', {
        propertyId: id,
        ...bookingData
      });
      
      toast.success('Booking request submitted successfully!');
      setShowBookingForm(false);
      setBookingData({ checkIn: '', checkOut: '', guests: 1, notes: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'user') {
      toast.error('Please login as a user to leave reviews');
      return;
    }

    setReviewLoading(true);
    
    try {
      const response = await axios.post('/reviews', {
        propertyId: id,
        ...newReview
      });
      
      setReviews([response.data.review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review added successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add review';
      toast.error(message);
    } finally {
      setReviewLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * property.price : 0;
  };

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    coffee: Coffee,
    tv: Tv
  };

  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }

  if (!property) {
    return <div className="error">Property not found</div>;
  }

  return (
    <div className="property-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="property-header">
          <div className="property-title">
            <h1>{property.title}</h1>
            <div className="property-location">
              <MapPin size={20} />
              <span>{property.location}</span>
            </div>
          </div>
          
          <div className="property-actions">
            {user && user.role === 'user' && (
              <button 
                onClick={toggleFavorite}
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            <div className="property-price">
              <span className="price">${property.price}</span>
              <span className="period">/night</span>
            </div>
          </div>
        </div>

        <div className="property-images">
          {property.images && property.images.length > 0 ? (
            <div className="images-grid">
              {property.images.map((image, index) => (
                <img 
                  key={index}
                  src={`http://localhost:5000${image}`} 
                  alt={`${property.title} ${index + 1}`}
                  className={index === 0 ? 'main-image' : 'thumbnail'}
                />
              ))}
            </div>
          ) : (
            <div className="no-images">
              <Building size={64} />
              <p>No images available</p>
            </div>
          )}
        </div>

        <div className="property-content">
          <div className="property-info">
            <div className="property-stats">
              <div className="stat">
                <Bed size={20} />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="stat">
                <Bath size={20} />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="stat">
                <Users size={20} />
                <span>{property.type}</span>
              </div>
              {property.area && (
                <div className="stat">
                  <span>{property.area} sq ft</span>
                </div>
              )}
            </div>

            {reviews.length > 0 && (
              <div className="rating-summary">
                <Star size={20} className="star-filled" />
                <span className="rating">{calculateAverageRating()}</span>
                <span className="review-count">({reviews.length} reviews)</span>
              </div>
            )}

            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description || 'No description available.'}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity.toLowerCase()] || Coffee;
                    return (
                      <div key={index} className="amenity">
                        <IconComponent size={20} />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="booking-sidebar">
            {property.available ? (
              <div className="booking-card">
                <h3>Book this property</h3>
                
                {!showBookingForm ? (
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="btn btn-primary btn-full"
                  >
                    <Calendar size={20} />
                    Book Now
                  </button>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="booking-form">
                    <div className="form-group">
                      <label>Check-in Date</label>
                      <input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Check-out Date</label>
                      <input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Guests</label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Special Requests (Optional)</label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                        placeholder="Any special requests..."
                        rows={3}
                      />
                    </div>
                    
                    {calculateTotalPrice() > 0 && (
                      <div className="price-breakdown">
                        <div className="price-row">
                          <span>Total Price:</span>
                          <span className="total-price">${calculateTotalPrice()}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        onClick={() => setShowBookingForm(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={bookingLoading}
                      >
                        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="unavailable-card">
                <h3>Currently Unavailable</h3>
                <p>This property is not available for booking at the moment.</p>
              </div>
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h3>Reviews ({reviews.length})</h3>
          
          {user && user.role === 'user' && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <h4>Leave a Review</h4>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                >
                  {[5,4,3,2,1].map(num => (
                    <option key={num} value={num}>{num} star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share your experience..."
                  rows={4}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
          
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < review.rating ? 'star-filled' : 'star-empty'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;