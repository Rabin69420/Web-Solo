import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Building, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const canCancelBooking = (booking) => {
    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    return booking.status === 'pending' || booking.status === 'confirmed' && checkInDate > today;
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>View and manage your property bookings</p>
        </div>

        <div className="bookings-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Bookings
          </button>
          <button 
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'confirmed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={filter === 'cancelled' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h2>No bookings found</h2>
            <p>
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start exploring properties to make your first booking!"
                : `No ${filter} bookings found.`
              }
            </p>
            <Link to="/properties" className="btn btn-primary">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-image">
                  {booking.property?.images && booking.property.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${booking.property.images[0]}`} 
                      alt={booking.property.title}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <Building size={48} />
                    </div>
                  )}
                </div>
                
                <div className="booking-details">
                  <div className="booking-header">
                    <h3>
                      <Link to={`/properties/${booking.property?.id}`}>
                        {booking.property?.title}
                      </Link>
                    </h3>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-location">
                    <MapPin size={16} />
                    <span>{booking.property?.location}</span>
                  </div>
                  
                  <div className="booking-info-grid">
                    <div className="info-item">
                      <label>Check-in:</label>
                      <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <label>Check-out:</label>
                      <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <label>Guests:</label>
                      <span>{booking.guests}</span>
                    </div>
                    <div className="info-item">
                      <label>Total Price:</label>
                      <span className="price">${booking.totalPrice}</span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="booking-notes">
                      <label>Notes:</label>
                      <p>{booking.notes}</p>
                    </div>
                  )}
                  
                  <div className="booking-dates-info">
                    <small>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
                
                <div className="booking-actions">
                  <Link 
                    to={`/properties/${booking.property?.id}`}
                    className="btn btn-outline"
                  >
                    View Property
                  </Link>
                  
                  {canCancelBooking(booking) && (
                    <button 
                      onClick={() => cancelBooking(booking.id)}
                      className="btn btn-danger"
                    >
                      <X size={16} />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;