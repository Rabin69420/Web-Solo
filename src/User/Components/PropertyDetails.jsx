import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Users, 
  Star,
  Heart,
  HeartOff,
  Phone,
  Mail,
  Shield,
  MessageSquare,
  Send,
  User,
  ThumbsUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const PropertyDetails = ({ 
  property, 
  isOpen = true, 
  onClose, 
  bookmarkedProperties, 
  toggleBookmark,
  isFullPage = false 
}) => {
  const [showReviews, setShowReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    reviewerName: ''
  });
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: "John Smith",
      rating: 5,
      comment: "Amazing property with stunning ocean views! The host was very responsive and the place was exactly as described.",
      date: "2024-01-15",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      reviewer: "Emily Chen",
      rating: 4,
      comment: "Beautiful location and well-maintained property. The infinity pool was a highlight of our stay.",
      date: "2024-01-10",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      reviewer: "Michael Rodriguez",
      rating: 5,
      comment: "Perfect for a long-term stay. Very comfortable and all amenities worked perfectly.",
      date: "2024-01-05",
      helpful: 15,
      verified: false
    },
    {
      id: 4,
      reviewer: "Sarah Wilson",
      rating: 4,
      comment: "Great location and clean property. Host was helpful and responsive to all queries.",
      date: "2023-12-28",
      helpful: 6,
      verified: true
    }
  ]);
  const [sortBy, setSortBy] = useState('newest');

  if (!isOpen || !property) return null;

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Extended property data for details view
  const propertyDetails = {
    ...property,
    bedrooms: property.bedrooms || 4,
    bathrooms: property.bathrooms || 3,
    maxGuests: property.maxOccupancy || 8,
    reviews: reviews.length,
    averageRating: parseFloat(averageRating),
    isAvailable: property.isAvailable ?? true,
    minRentalDuration: 3,
    maxOccupants: property.maxOccupancy || 6,
    description: "Escape to this stunning oceanfront paradise where luxury meets comfort. This exquisite villa offers breathtaking panoramic views of the Pacific Ocean, featuring an infinity pool that seems to merge with the horizon. The spacious interior boasts contemporary design with floor-to-ceiling windows, allowing natural light to flood every room.",
    rules: [
      'No smoking inside the property',
      'No pets allowed',
      'Quiet hours: 10 PM - 8 AM',
      `Maximum ${property.maxOccupancy || 6} occupants allowed`,
      'Minimum 3-month rental required',
      'Security deposit required'
    ],
    host: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@renteasy.com'
    },
    images: [
      property.image,
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ]
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    const review = {
      id: reviews.length + 1,
      reviewer: newReview.reviewerName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: false
    };

    setReviews(prev => [review, ...prev]);
    
    // Reset form
    setNewReview({
      rating: 5,
      comment: '',
      reviewerName: ''
    });
    setShowAddReview(false);
    setShowReviews(true); 
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-amber-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderLargeStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-amber-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Sort reviews based on selected criteria
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default: // newest
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // Content component that can be wrapped differently based on mode
  const PropertyContent = () => (
    <>
      {/* Header */}
      <div className="relative">
        {/* Close button only for modal mode */}
        {!isFullPage && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        )}
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-64 md:h-80">
          <div className="md:col-span-2">
            <img
              src={propertyDetails.images[0]}
              alt={propertyDetails.title}
              className={`w-full h-full object-cover ${isFullPage ? 'rounded-tl-3xl' : 'rounded-tl-3xl md:rounded-bl-3xl'}`}
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <img
              src={propertyDetails.images[1]}
              alt="Property view 2"
              className="w-full h-full object-cover rounded-tr-3xl"
            />
            <div className="relative">
              <img
                src={propertyDetails.images[2]}
                alt="Property view 3"
                className={`w-full h-full object-cover ${isFullPage ? 'rounded-br-3xl' : 'rounded-br-3xl'}`}
              />
              <div className="absolute inset-0 bg-black/40 rounded-br-3xl flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{propertyDetails.images.length - 3} more photos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                    {propertyDetails.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                    <span className="text-lg">{propertyDetails.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(propertyDetails.id)}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  {bookmarkedProperties?.includes(propertyDetails.id) ? (
                    <Heart className="w-6 h-6 text-red-500 fill-current" />
                  ) : (
                    <HeartOff className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Enhanced Reviews Section */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="flex items-center bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center mr-3">
                    {renderLargeStars(Math.round(propertyDetails.averageRating))}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-blue-700 text-lg">{averageRating}</span>
                    <span className="text-sm text-blue-600">({propertyDetails.reviews} reviews)</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowAddReview(true)}
                  className="flex items-center bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition-colors"
                >
                  <Send className="w-4 h-4 text-green-600 mr-2" />
                  <span className="font-semibold text-green-700">Write Review</span>
                </button>
                
                <div className="flex items-center text-green-600">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verified Property</span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl">
                <div className="text-center">
                  <Bed className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{propertyDetails.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{propertyDetails.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{propertyDetails.maxOccupants}</div>
                  <div className="text-sm text-gray-600">Max Occupants</div>
                </div>
              </div>
            </div>

            {/* Enhanced Reviews Display */}
            {showReviews && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-900">Guest Reviews</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>

                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-900 mb-2">{averageRating}</div>
                    <div className="flex items-center justify-center mb-2">
                      {renderLargeStars(Math.round(propertyDetails.averageRating))}
                    </div>
                    <p className="text-gray-600">Based on {reviews.length} reviews</p>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <span className="text-sm font-medium w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: reviews.length > 0 
                                ? `${(ratingDistribution[rating] / reviews.length) * 100}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {sortedReviews.map((review) => (
                    <div key={review.id} className="p-6 bg-slate-50 rounded-2xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <User className="w-10 h-10 text-gray-400 bg-gray-200 rounded-full p-2" />
                          <div className="ml-3">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-slate-900">{review.reviewer}</h4>
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" title="Verified Guest" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                        </div>
                        {review.verified && (
                          <span className="text-xs text-green-600 font-medium">✓ Verified Stay</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Add Review Form */}
            {showAddReview && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Write a Review</h2>
                <form onSubmit={handleSubmitReview} className="p-6 bg-slate-50 rounded-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={newReview.reviewerName}
                      onChange={(e) => setNewReview(prev => ({...prev, reviewerName: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Overall Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({...prev, rating: star}))}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= newReview.rating ? 'text-amber-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-600">
                        {newReview.rating === 1 && "Poor"}
                        {newReview.rating === 2 && "Fair"}
                        {newReview.rating === 3 && "Good"}
                        {newReview.rating === 4 && "Very Good"}
                        {newReview.rating === 5 && "Excellent"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell others about your experience with this property. What did you like? What could be improved?"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 10 characters ({newReview.comment.length}/10)
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={newReview.comment.length < 10}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddReview(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {propertyDetails.description}
              </p>
            </div>

            {/* House Rules */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">House Rules</h2>
              <ul className="space-y-3">
                {propertyDetails.rules.map((rule, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Host Information */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Meet your host</h2>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900">{propertyDetails.host.name}</h3>
                  
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span className="text-base">{propertyDetails.host.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span className="text-base">{propertyDetails.host.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
              {/* Price Section with Bookmark */}
              <div className="flex items-start justify-between mb-6">
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center text-3xl font-bold text-slate-900 mb-2">
                    <DollarSign className="w-8 h-8 mr-1" />
                    {propertyDetails.price?.toLocaleString()}
                    <span className="text-lg text-gray-500 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600">Monthly rental rate</p>
                </div>
                
                <button
                  onClick={() => toggleBookmark(propertyDetails.id)}
                  className="ml-4 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md"
                  title={bookmarkedProperties?.includes(propertyDetails.id) ? "Remove from bookmarks" : "Add to bookmarks"}
                >
                  {bookmarkedProperties?.includes(propertyDetails.id) ? (
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  ) : (
                    <HeartOff className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Rental Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rental Duration</label>
                  <div className="p-3 border border-gray-300 rounded-xl bg-gray-50">
                    <span className="text-gray-700 font-medium">
                      {propertyDetails.minRentalDuration} months minimum
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Occupants</label>
                  <div className="p-3 border border-gray-300 rounded-xl bg-gray-50">
                    <span className="text-gray-700 font-medium">
                      Up to {propertyDetails.maxOccupants} people
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Monthly rent</span>
                  <span>${propertyDetails.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Security deposit</span>
                  <span>${((propertyDetails.price || 0) * 0.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Application fee</span>
                  <span>$100</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 pt-3 border-t border-gray-200">
                  <span>Move-in cost</span>
                  <span>${((propertyDetails.price || 0) + ((propertyDetails.price || 0) * 0.5) + 100).toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  *Security deposit refundable upon lease completion
                </div>
              </div>

              {/* Contact Host Button */}
              <button 
                className="w-full font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                Contact the Host to Book the Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Return different wrappers based on mode
  if (isFullPage) {
    // Full page mode - no modal wrapper
    return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <PropertyContent />
      </div>
    );
  }

  // Modal mode - with backdrop and modal wrapper
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="relative min-h-screen px-4 py-8">
        <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
          <PropertyContent />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
