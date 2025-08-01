import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building, Plus, Eye, Edit, Trash2, MapPin, Bed, Bath, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminProperties.css';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/properties/admin/my-properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => {
        if (statusFilter === 'available') return property.available;
        if (statusFilter === 'unavailable') return !property.available;
        return true;
      });
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const deleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/properties/${propertyId}`);
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const toggleAvailability = async (propertyId, currentStatus) => {
    try {
      await axios.patch(`/properties/${propertyId}`, {
        available: !currentStatus
      });
      toast.success(`Property ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    }
  };

  const propertyTypes = [...new Set(properties.map(p => p.type))];

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div className="admin-properties-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Properties</h1>
            <p>Manage your rental properties</p>
          </div>
          <Link to="/admin/properties/new" className="btn btn-primary">
            <Plus size={16} />
            Add New Property
          </Link>
        </div>

        <div className="properties-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search properties by title or location..."
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
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Type:</label>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="properties-stats">
          <div className="stat">
            <span className="stat-number">{properties.length}</span>
            <span className="stat-label">Total Properties</span>
          </div>
          <div className="stat">
            <span className="stat-number">{properties.filter(p => p.available).length}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat">
            <span className="stat-number">{properties.filter(p => !p.available).length}</span>
            <span className="stat-label">Unavailable</span>
          </div>
          <div className="stat">
            <span className="stat-number">{filteredProperties.length}</span>
            <span className="stat-label">Showing</span>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="empty-state">
            <Building size={64} />
            <h2>
              {properties.length === 0 
                ? 'No properties yet' 
                : 'No properties match your filters'
              }
            </h2>
            <p>
              {properties.length === 0 
                ? 'Start by adding your first property to begin earning rental income.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {properties.length === 0 && (
              <Link to="/admin/properties/new" className="btn btn-primary">
                <Plus size={16} />
                Add Your First Property
              </Link>
            )}
          </div>
        ) : (
          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${property.images[0]}`} 
                      alt={property.title}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <Building size={48} />
                    </div>
                  )}
                  
                  <div className="property-badges">
                    <span className={`status-badge ${property.available ? 'available' : 'unavailable'}`}>
                      {property.available ? 'Available' : 'Unavailable'}
                    </span>
                    {property.images && property.images.length > 1 && (
                      <span className="images-count">
                        +{property.images.length - 1} photos
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="property-info">
                  <div className="property-header">
                    <h3>{property.title}</h3>
                    <div className="property-price">
                      <span className="price">${property.price}</span>
                      <span className="period">/night</span>
                    </div>
                  </div>
                  
                  <div className="property-location">
                    <MapPin size={14} />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="property-features">
                    <div className="feature">
                      <Bed size={14} />
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="feature">
                      <Bath size={14} />
                      <span>{property.bathrooms} baths</span>
                    </div>
                    <div className="feature">
                      <span className="property-type">{property.type}</span>
                    </div>
                  </div>
                  
                  <div className="property-description">
                    <p>{property.description?.substring(0, 100)}...</p>
                  </div>
                  
                  <div className="property-stats">
                    <div className="stat-item">
                      <span className="stat-label">Reviews:</span>
                      <span className="stat-value">{property.reviews?.length || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Bookings:</span>
                      <span className="stat-value">{property.bookings?.length || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="property-actions">
                  <div className="action-row">
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
                  </div>
                  
                  <div className="action-row">
                    <button 
                      onClick={() => toggleAvailability(property.id, property.available)}
                      className={`btn btn-sm ${property.available ? 'btn-warning' : 'btn-success'}`}
                    >
                      {property.available ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => deleteProperty(property.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="property-meta">
                  <small>Created: {new Date(property.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;