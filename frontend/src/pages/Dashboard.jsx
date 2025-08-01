import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Heart, Star, MapPin, Building, User } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFavorites: 0,
    totalReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, favoritesRes, reviewsRes] = await Promise.all([
        axios.get('/bookings/my-bookings'),
        axios.get('/favorites'),
        axios.get('/reviews')
      ]);

      setStats({
        totalBookings: bookingsRes.data.length,
        totalFavorites: favoritesRes.data.length,
        totalReviews: reviewsRes.data.length
      });

      setRecentBookings(bookingsRes.data.slice(0, 3));
      setRecentFavorites(favoritesRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your bookings, favorites, and reviews</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalFavorites}</h3>
              <p>Favorite Properties</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Star size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalReviews}</h3>
              <p>Reviews Written</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/bookings" className="view-all-link">View All</Link>
            </div>
            
            {recentBookings.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <h3>No bookings yet</h3>
                <p>Start exploring properties to make your first booking</p>
                <Link to="/properties" className="btn btn-primary">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-image">
                      {booking.property?.images && booking.property.images.length > 0 ? (
                        <img 
                          src={`http://localhost:5000${booking.property.images[0]}`} 
                          alt={booking.property.title}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <Building size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="booking-info">
                      <h4>{booking.property?.title}</h4>
                      <div className="booking-location">
                        <MapPin size={16} />
                        <span>{booking.property?.location}</span>
                      </div>
                      <div className="booking-dates">
                        <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="booking-price">
                        <span>${booking.totalPrice}</span>
                      </div>
                    </div>
                    
                    <div className="booking-status">
                      <span className={`status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Favorite Properties</h2>
              <Link to="/favorites" className="view-all-link">View All</Link>
            </div>
            
            {recentFavorites.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} />
                <h3>No favorites yet</h3>
                <p>Save properties you like to easily find them later</p>
                <Link to="/properties" className="btn btn-primary">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="favorites-grid">
                {recentFavorites.map((favorite) => (
                  <Link 
                    key={favorite.id} 
                    to={`/properties/${favorite.property.id}`}
                    className="favorite-card"
                  >
                    <div className="favorite-image">
                      {favorite.property?.images && favorite.property.images.length > 0 ? (
                        <img 
                          src={`http://localhost:5000${favorite.property.images[0]}`} 
                          alt={favorite.property.title}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <Building size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="favorite-info">
                      <h4>{favorite.property?.title}</h4>
                      <div className="favorite-location">
                        <MapPin size={14} />
                        <span>{favorite.property?.location}</span>
                      </div>
                      <div className="favorite-price">
                        <span>${favorite.property?.price}/night</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/properties" className="action-card">
              <Building size={32} />
              <h3>Browse Properties</h3>
              <p>Find your next perfect stay</p>
            </Link>
            
            <Link to="/bookings" className="action-card">
              <Calendar size={32} />
              <h3>My Bookings</h3>
              <p>View and manage your bookings</p>
            </Link>
            
            <Link to="/favorites" className="action-card">
              <Heart size={32} />
              <h3>My Favorites</h3>
              <p>See your saved properties</p>
            </Link>
            
            <Link to="/profile" className="action-card">
              <User size={32} />
              <h3>My Profile</h3>
              <p>Update your account settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;