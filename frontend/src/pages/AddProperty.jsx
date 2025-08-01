import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, MapPin, DollarSign, Bed, Bath, Home, Image, Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: 'apartment',
    amenities: [],
    available: true
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newAmenity, setNewAmenity] = useState('');

  const propertyTypes = [
    'apartment',
    'house',
    'villa',
    'studio',
    'condo',
    'townhouse',
    'loft',
    'cabin',
    'cottage'
  ];

  const commonAmenities = [
    'WiFi',
    'Air Conditioning',
    'Heating',
    'Kitchen',
    'Parking',
    'Pool',
    'Gym',
    'Balcony',
    'Garden',
    'Laundry',
    'TV',
    'Dishwasher',
    'Microwave',
    'Refrigerator',
    'Washer',
    'Dryer',
    'Hot Tub',
    'Fireplace',
    'Pet Friendly',
    'Smoking Allowed'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const addAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  const removeAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      images.forEach(image => {
        submitData.append('images', image);
      });

      await axios.post('/properties', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Property added successfully!');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page">
      <div className="container">
        <div className="page-header">
          <h1>Add New Property</h1>
          <p>List a new property for rent</p>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">
                <Building size={16} />
                Property Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter property title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">
                  <DollarSign size={16} />
                  Price per Night *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">
                  <Home size={16} />
                  Property Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <MapPin size={16} />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter property location"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Property Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">
                  <Bed size={16} />
                  Bedrooms *
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">
                  <Bath size={16} />
                  Bathrooms *
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                />
                Available for booking
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>Images</h2>
            
            <div className="image-upload">
              <label htmlFor="images" className="upload-area">
                <Image size={32} />
                <span>Click to upload images</span>
                <small>Maximum 10 images, each up to 5MB</small>
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Amenities</h2>
            
            <div className="amenities-section">
              <div className="common-amenities">
                <h3>Common Amenities</h3>
                <div className="amenities-grid">
                  {commonAmenities.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      className={`amenity-btn ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                      onClick={() => 
                        formData.amenities.includes(amenity) 
                          ? removeAmenity(amenity)
                          : addAmenity(amenity)
                      }
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-amenities">
                <h3>Add Custom Amenity</h3>
                <div className="custom-amenity-input">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Enter custom amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                  />
                  <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="btn btn-outline"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div className="selected-amenities">
                  <h3>Selected Amenities</h3>
                  <div className="amenities-list">
                    {formData.amenities.map(amenity => (
                      <span key={amenity} className="amenity-tag">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Adding Property...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;