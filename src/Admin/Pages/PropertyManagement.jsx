import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Users,
  Eye,
  Building2,
  Filter,
  Search,
  X
} from 'lucide-react';
import AddProperty from '../Components/AddProperty';
import PropertyPhotoManager from '../Components/PropertyPhotoManager';
import PropertyDetailsModal from '../Components/PropertydetailsModel';
import AdminDashboardHeader from '../Components/AdminDashboardHeader';

const PropertiesDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "123 Main St, Downtown",
      price: 1500,
      type: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      maxOccupancy: 4,
      description: "Beautiful modern apartment in the heart of downtown",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
      images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"],
      houseRules: ["No smoking", "Quiet hours: 10 PM - 8 AM"],
      status: "Available"
    },
    {
      id: 2,
      title: "Cozy Studio Apartment",
      location: "456 Oak Street, Midtown",
      price: 1200,
      type: "studio",
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2,
      description: "Perfect studio for young professionals",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
      houseRules: ["No pets", "No smoking"],
      status: "Occupied"
    },
    {
      id: 3,
      title: "Luxury House",
      location: "789 Pine Avenue, Uptown",
      price: 2500,
      type: "house",
      bedrooms: 4,
      bathrooms: 3,
      maxOccupancy: 8,
      description: "Spacious luxury house with garden",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400"],
      houseRules: ["No parties", "No smoking"],
      status: "Available"
    }
  ]);

  // Filtered properties using useMemo for performance
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesType = typeFilter === 'all' || property.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, searchTerm, statusFilter, typeFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    return count;
  }, [searchTerm, statusFilter, typeFilter]);

  // Add Property
  const handleAddProperty = () => setShowAddModal(true);
  const handleAddPropertySave = (propertyData) => {
    const newProp = {
      ...propertyData,
      id: Date.now(),
      images: propertyData.image ? [propertyData.image] : [],
      status: "Available"
    };
    setProperties(ps => [...ps, newProp]);
    setShowAddModal(false);
  };
  const handleAddModalClose = () => setShowAddModal(false);

  // Edit Property
  const handleEditProperty = (p) => {
    setEditingProperty(p);
    setShowEditModal(true);
  };
  const handleEditPropertySave = (data) => {
    setProperties(ps =>
      ps.map(p =>
        p.id === editingProperty.id
          ? { ...data, id: p.id, houseRules: editingProperty.houseRules, status: editingProperty.status }
          : p
      )
    );
    setShowEditModal(false);
    setEditingProperty(null);
  };
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingProperty(null);
  };

  // View Details
  const handleViewProperty = (p) => {
    setViewingProperty(p);
    setShowViewModal(true);
  };
  const handleViewModalClose = () => {
    setShowViewModal(false);
    setViewingProperty(null);
  };

  // Toggle Status Function
  const togglePropertyStatus = (propertyId) => {
    setProperties(ps =>
      ps.map(p =>
        p.id === propertyId
          ? { ...p, status: p.status === "Available" ? "Occupied" : "Available" }
          : p
      )
    );
  };

  // Delete
  const handleDeleteProperty = (id) => {
    if (window.confirm("Delete this property?")) {
      setProperties(ps => ps.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Property Management
                </h1>
                <p className="text-gray-600">
                  Oversee and manage all rental properties
                </p>
              </div>
            </div>
            <button
              onClick={handleAddProperty}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-colors relative ${
                  showFilters 
                    ? 'bg-orange-50 border-orange-200 text-orange-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </div>
                )}
              </button>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="room">Room</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - Updated to show filtered results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  {activeFiltersCount > 0 ? 'Filtered Properties' : 'Total Properties'}
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredProperties.length}
                  {activeFiltersCount > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      of {properties.length}
                    </span>
                  )}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Available</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredProperties.filter(p => p.status === "Available").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Occupied</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredProperties.filter(p => p.status === "Occupied").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {activeFiltersCount > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  Showing {filteredProperties.length} of {properties.length} properties
                </span>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Property Cards - Now showing filtered results */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20">
              {activeFiltersCount > 0 ? (
                <div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first rental property.</p>
                  <button
                    onClick={handleAddProperty}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
                  >
                    Add Your First Property
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredProperties.map(property => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Property Image */}
                <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-orange-200">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="w-8 h-8 text-orange-500" />
                    </div>
                  )}

                  {/* Property Type Badge */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 capitalize shadow-lg">
                    {property.type}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {property.title}
                  </h3>

                  {/* Clickable Status Badge */}
                  <div className="mb-3">
                    <button
                      onClick={() => togglePropertyStatus(property.id)}
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105 cursor-pointer ${
                        property.status === "Available"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                      title={`Click to mark as ${property.status === "Available" ? "Occupied" : "Available"}`}
                    >
                      {property.status}
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm line-clamp-1">{property.location}</span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center justify-between mb-4 text-gray-600">
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                      <Bed className="w-4 h-4 mr-1 text-orange-500" />
                      <span className="text-sm font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                      <Bath className="w-4 h-4 mr-1 text-orange-500" />
                      <span className="text-sm font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                      <Users className="w-4 h-4 mr-1 text-orange-500" />
                      <span className="text-sm font-medium">{property.maxOccupancy}</span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">
                        ${property.price}
                      </span>
                      <span className="text-gray-600 text-sm ml-1">/month</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewProperty(property)}
                        className="p-2 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-2 text-orange-600 rounded-full hover:bg-orange-50 transition-colors"
                        title="Edit Property"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <AddProperty
        isOpen={showAddModal}
        onClose={handleAddModalClose}
        onAddProperty={handleAddPropertySave}
      />

      {showEditModal && (
        <PropertyPhotoManager
          property={editingProperty}
          onSave={handleEditPropertySave}
          onClose={handleEditModalClose}
        />
      )}

      {showViewModal && (
        <PropertyDetailsModal
          isOpen={showViewModal}
          property={viewingProperty}
          onClose={handleViewModalClose}
        />
      )}
    </div>
  );
};

export default PropertiesDashboard;
