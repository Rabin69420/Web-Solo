import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building, Calendar, Users, Star, Plus, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [propertiesRes, bookingsRes] = await Promise.all([
        axios.get('/properties/admin/my-properties'),
        axios.get('/bookings/admin/property-bookings')
      ]);

      const properties = propertiesRes.data;
      const bookings = bookingsRes.data;

      const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
      const totalRevenue = bookings
        .filter(booking => booking.status === 'completed')
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      setStats({
        totalProperties: properties.length,
        totalBookings: bookings.length,
        pendingBookings,
        totalRevenue
      });

      setRecentProperties(properties.slice(0, 3));
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`/properties/${propertyId}`);
      toast.success('Property deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchDashboardData();
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

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}! Manage your properties and bookings</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Building size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProperties}</h3>
              <p>Total Properties</p>
            </div>
          </div>
          
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
              <Users size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingBookings}</h3>
              <p>Pending Bookings</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Star size={32} />
            </div>
            <div className="stat-info">
              <h3>${stats.totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Properties</h2>
              <div className="section-actions">
                <Link to="/admin/properties" className="view-all-link">View All</Link>
                <Link to="/admin/properties/new" className="btn btn-primary">
                  <Plus size={16} />
                  Add Property
                </Link>
              </div>
            </div>
            
            {recentProperties.length === 0 ? (
              <div className="empty-state">
                <Building size={48} />
                <h3>No properties yet</h3>
                <p>Start by adding your first property</p>
                <Link to="/admin/properties/new" className="btn btn-primary">
                  <Plus size={16} />
                  Add Property
                </Link>
              </div>
            ) : (
              <div className="properties-grid">
                {recentProperties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div className="property-image">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={`http://localhost:5000${property.images[0]}`} 
                          alt={property.title}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <Building size={32} />
                        </div>
                      )}
                      <div className="property-status">
                        <span className={`status-badge ${property.available ? 'available' : 'unavailable'}`}>
                          {property.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="property-info">
                      <h4>{property.title}</h4>
                      <div className="property-location">
                        <MapPin size={14} />
                        <span>{property.location}</span>
                      </div>
                      <div className="property-price">
                        <span>${property.price}/night</span>
                      </div>
                      <div className="property-meta">
                        <span>{property.bedrooms} beds • {property.bathrooms} baths</span>
                      </div>
                    </div>
                    
                    <div className="property-actions">
                      <Link 
                        to={`/properties/${property.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                      <Link 
                        to={`/admin/properties/${property.id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteProperty(property.id)}
                        className="btn btn-outline btn-danger btn-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/admin/bookings" className="view-all-link">View All</Link>
            </div>
            
            {recentBookings.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <h3>No bookings yet</h3>
                <p>Bookings will appear here once users start booking your properties</p>
              </div>
            ) : (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Guest</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="booking-property">
                            <strong>{booking.property?.title}</strong>
                            <small>{booking.property?.location}</small>
                          </div>
                        </td>
                        <td>
                          <div className="booking-guest">
                            <strong>{booking.user?.name}</strong>
                            <small>{booking.user?.email}</small>
                          </div>
                        </td>
                        <td>
                          <div className="booking-dates">
                            <small>
                              {new Date(booking.checkIn).toLocaleDateString()} - 
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </small>
                          </div>
                        </td>
                        <td>
                          <strong>${booking.totalPrice}</strong>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(booking.status)}`}>
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
                                >
                                  Confirm
                                </button>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="btn btn-sm btn-danger"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button 
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                className="btn btn-sm btn-primary"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/properties/new" className="action-card">
              <Plus size={32} />
              <h3>Add Property</h3>
              <p>List a new property for rent</p>
            </Link>
            
            <Link to="/admin/properties" className="action-card">
              <Building size={32} />
              <h3>Manage Properties</h3>
              <p>View and edit your properties</p>
            </Link>
            
            <Link to="/admin/bookings" className="action-card">
              <Calendar size={32} />
              <h3>Manage Bookings</h3>
              <p>Handle booking requests</p>
            </Link>
            
            <Link to="/profile" className="action-card">
              <Users size={32} />
              <h3>Profile Settings</h3>
              <p>Update your account information</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;