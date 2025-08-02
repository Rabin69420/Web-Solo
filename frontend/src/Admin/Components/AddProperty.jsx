import React, { useState } from 'react';
import { 
  X,
  Camera,
  PlusCircle,
  Minus,
  Save,
  ArrowLeft
} from 'lucide-react';
import { IMAGE_BASE_URL } from '../../services/api';

const AddProperty = ({ isOpen, onClose, onAddProperty }) => {
  // Form state for adding new property
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: '',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupancy: 2,
    description: '',
    images: [],
    houseRules: [''] // Initialize with one empty rule
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setNewProperty(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };



  const handleHouseRuleChange = (index, value) => {
    const updatedRules = [...newProperty.houseRules];
    updatedRules[index] = value;
    setNewProperty(prev => ({
      ...prev,
      houseRules: updatedRules
    }));
  };

  const addHouseRule = () => {
    setNewProperty(prev => ({
      ...prev,
      houseRules: [...prev.houseRules, '']
    }));
  };

  const removeHouseRule = (index) => {
    if (newProperty.houseRules.length > 1) {
      const updatedRules = newProperty.houseRules.filter((_, i) => i !== index);
      setNewProperty(prev => ({
        ...prev,
        houseRules: updatedRules
      }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'Image size should be less than 10MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProperty(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
        setErrors(prev => ({ ...prev, images: '' }));
      };
      reader.readAsDataURL(file);
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newProperty.title.trim()) {
      newErrors.title = 'Property title is required';
    }

    if (!newProperty.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!newProperty.price || newProperty.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!newProperty.description.trim()) {
      newErrors.description = 'Description is required';
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Filter out empty house rules
    const validHouseRules = newProperty.houseRules.filter(rule => rule.trim() !== '');

    const propertyData = {
      ...newProperty,
      price: parseInt(newProperty.price),
      houseRules: validHouseRules.length > 0 ? validHouseRules : ['No specific rules'],
      images: newProperty.images.length > 0 ? newProperty.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300']
    };

    onAddProperty(propertyData);
    handleReset();
  };

  const handleReset = () => {
    setNewProperty({
      title: '',
      location: '',
      price: '',
      type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      maxOccupancy: 2,
      description: '',
      images: [],
      houseRules: [''],
      host: {
        name: '',
        phone: '',
        email: ''
      }
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClose}
                  className="p-2 text-white/80 hover:text-white rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Add New Property</h2>
                  <p className="text-orange-100">Fill in the details to list a new rental property</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={newProperty.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter property title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={newProperty.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="room">Room</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={newProperty.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full address"
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Rent ($) *
                    </label>
                    <input
                      type="number"
                      value={newProperty.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter monthly rent amount"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                    <select
                      value={newProperty.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                    <select
                      value={newProperty.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Occupancy</label>
                    <select
                      value={newProperty.maxOccupancy}
                      onChange={(e) => handleInputChange('maxOccupancy', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,12,15].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>



              {/* Description Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <textarea
                  value={newProperty.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the property, its features, amenities, and what makes it special..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* House Rules Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
                  <button
                    type="button"
                    onClick={addHouseRule}
                    className="flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium bg-orange-50 px-3 py-2 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Rule
                  </button>
                </div>
                <div className="space-y-3">
                  {newProperty.houseRules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => handleHouseRuleChange(index, e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="Enter house rule..."
                        />
                      </div>
                      {newProperty.houseRules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHouseRule(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Add rules that tenants should follow (e.g., "No smoking", "Quiet hours: 10 PM - 8 AM")
                </p>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                  {newProperty.images.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {newProperty.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image.startsWith('data:') ? image : `${IMAGE_BASE_URL}${image}`} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-xl" />
                            <button
                              onClick={() => {
                                const updatedImages = newProperty.images.filter((_, i) => i !== index);
                                handleInputChange('images', updatedImages);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label className="cursor-pointer inline-block">
                        <span className="text-orange-600 font-medium hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors">
                          Add More Images
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-orange-600 font-medium hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors">
                          Upload images
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB each. You can select multiple images.</p>
                    </div>
                  )}
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Reset Form
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
