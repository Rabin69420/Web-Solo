import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, MapPin, Building, Check, X, Clock, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/bookings/admin/property-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.property?.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      filtered = filtered.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        
        switch (dateFilter) {
          case 'upcoming':
            return checkIn > today;
          case 'current':
            return checkIn <= today && checkOut >= today;
          case 'past':
            return checkOut < today;
          case 'today':
            return booking.checkIn === todayStr || booking.checkOut === todayStr;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <Check size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'cancelled': return <X size={16} />;
      case 'completed': return <Check size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBookingStats = () => {
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    return { pending, confirmed, completed, cancelled, totalRevenue };
  };

  const stats = getBookingStats();

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="admin-bookings-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Property Bookings</h1>
            <p>Manage bookings for your properties</p>
          </div>
        </div>

        <div className="bookings-stats">
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.confirmed}</h3>
              <p>Confirmed</p>
            </div>
            <div className="stat-icon confirmed">
              <Check size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-icon completed">
              <Check size={24} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>${stats.totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
            <div className="stat-icon revenue">
              <Building size={24} />
            </div>
          </div>
        </div>

        <div className="bookings-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by property, location, or guest name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date:</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="past">Past</option>
                <option value="today">Today</option>
              </select>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h2>
              {bookings.length === 0 
                ? 'No bookings yet' 
                : 'No bookings match your filters'
              }
            </h2>
            <p>
              {bookings.length === 0 
                ? 'Bookings will appear here once guests start booking your properties.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Guest</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-property">
                        <div className="property-image">
                          {booking.property?.images && booking.property.images.length > 0 ? (
                            <img 
                              src={`http://localhost:5000${booking.property.images[0]}`} 
                              alt={booking.property.title}
                            />
                          ) : (
                            <div className="placeholder-image">
                              <Building size={20} />
                            </div>
                          )}
                        </div>
                        <div className="property-info">
                          <strong>{booking.property?.title}</strong>
                          <div className="property-location">
                            <MapPin size={12} />
                            <span>{booking.property?.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="booking-guest">
                        <div className="guest-avatar">
                          {booking.user?.avatar ? (
                            <img 
                              src={`http://localhost:5000${booking.user.avatar}`} 
                              alt={booking.user.name}
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                        <div className="guest-info">
                          <strong>{booking.user?.name}</strong>
                          <small>{booking.user?.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="booking-dates">
                        <div className="check-in">
                          <strong>Check-in:</strong>
                          <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                        </div>
                        <div className="check-out">
                          <strong>Check-out:</strong>
                          <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="duration">
                        {calculateNights(booking.checkIn, booking.checkOut)} nights
                      </span>
                    </td>
                    <td>
                      <span className="guests-count">{booking.guests}</span>
                    </td>
                    <td>
                      <div className="booking-amount">
                        <strong>${booking.totalPrice}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="booking-actions">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="btn btn-sm btn-success"
                              title="Confirm booking"
                            >
                              <Check size={14} />
                              Confirm
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="btn btn-sm btn-danger"
                              title="Cancel booking"
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            className="btn btn-sm btn-primary"
                            title="Mark as completed"
                          >
                            <Check size={14} />
                            Complete
                          </button>
                        )}
                        <Link 
                          to={`/properties/${booking.property?.id}`}
                          className="btn btn-sm btn-outline"
                          title="View property"
                        >
                          View Property
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBookings.length > 0 && (
          <div className="table-footer">
            <p>Showing {filteredBookings.length} of {bookings.length} bookings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;