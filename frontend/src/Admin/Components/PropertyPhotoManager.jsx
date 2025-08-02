import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Trash2, 
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { IMAGE_BASE_URL } from '../../services/api';

const PropertyPhotoManager = ({ 
  property, 
  onSave, 
  onClose 
}) => {
  const [photos, setPhotos] = useState(
    property?.images?.map((url, index) => ({
      id: `existing-${index}`,
      url: url,
      name: `Photo ${index + 1}`,
      isNew: false
    })) || []
  );
  const [propertyData, setPropertyData] = useState({
    title: property?.title || '',
    location: property?.location || '',
    price: property?.price || '',
    type: property?.type || 'apartment',
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    maxOccupancy: property?.maxOccupancy || 2,
    description: property?.description || ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setPropertyData(prev => ({
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



  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotos(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name,
            isNew: true
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    event.target.value = '';
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const makeMainPhoto = (photoId) => {
    setPhotos(prev => {
      const photoIndex = prev.findIndex(p => p.id === photoId);
      if (photoIndex > 0) {
        const newPhotos = [...prev];
        const [photo] = newPhotos.splice(photoIndex, 1);
        newPhotos.unshift(photo);
        return newPhotos;
      }
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!propertyData.title.trim()) {
      newErrors.title = 'Property title is required';
    }

    if (!propertyData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!propertyData.price || propertyData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!propertyData.description.trim()) {
      newErrors.description = 'Description is required';
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updatedProperty = {
      ...propertyData,
      images: photos.map(p => p.url)
    };
    onSave(updatedProperty);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {property ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Information - Wider Column */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
              
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title *</label>
                    <input
                      type="text"
                      value={propertyData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter property title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={propertyData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full address"
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                      <select
                        value={propertyData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="studio">Studio</option>
                        <option value="room">Room</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent ($) *</label>
                      <input
                        type="number"
                        value={propertyData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                      <select
                        value={propertyData.bedrooms}
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
                        value={propertyData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Max Guests</label>
                      <select
                        value={propertyData.maxOccupancy}
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
              </div>



              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Description</h4>
                <textarea
                  value={propertyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the property..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Photo Management */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Property Photos</h3>
                <div className="text-sm text-gray-500">
                  {photos.length}/10 photos
                </div>
              </div>

              {/* Photo Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={photos.length >= 10}
                />
                <label 
                  htmlFor="photo-upload" 
                  className={`cursor-pointer ${photos.length >= 10 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {photos.length >= 10 ? 'Maximum photos reached' : 'Upload Photos'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {photos.length < 10 ? 'Click to select multiple images (max 10)' : 'Remove photos to add new ones'}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Photos Grid */}
              {photos.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="relative group">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={photo.url && photo.url.startsWith('data:') ? photo.url : `${IMAGE_BASE_URL}${photo.url}`}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Main Photo Badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              Main Photo
                            </div>
                          )}

                          {/* Photo Actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            {index !== 0 && (
                              <button
                                onClick={() => makeMainPhoto(photo.id)}
                                className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                title="Make main photo"
                              >
                                <ImageIcon className="w-4 h-4 text-gray-700" />
                              </button>
                            )}
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Remove photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Photo Info */}
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 truncate">
                            {photo.name || `Photo ${index + 1}`}
                          </p>
                          {photo.isNew && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Photo Management Tips */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-orange-800 mb-2">Photo Tips:</h4>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• First photo will be used as the main property image</li>
                      <li>• Click "Make main photo" to reorder photos</li>
                      <li>• High-quality images get more attention</li>
                      <li>• Show different angles and rooms</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {photos.length === 0 && (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No photos uploaded yet</p>
                  <p className="text-xs text-gray-400">Add photos to showcase your property</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
            >
              {property ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPhotoManager;
