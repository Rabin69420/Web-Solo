import { Op } from 'sequelize';
import { Property, Review, SavedProperty, Booking } from '../models/index.js';

export const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      location,
      propertyType,
      accommodationType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      maxOccupancy,
      featured,
      available
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (accommodationType) {
      where.accommodationType = accommodationType;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (bedrooms) {
      where.bedrooms = { [Op.gte]: bedrooms };
    }

    if (bathrooms) {
      where.bathrooms = { [Op.gte]: bathrooms };
    }

    if (maxOccupancy) {
      where.maxOccupancy = { [Op.gte]: maxOccupancy };
    }

    if (featured !== undefined) {
      where.isFeatured = featured === 'true';
    }

    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      include: [
        {
          association: 'reviews',
          attributes: ['rating'],
          where: { status: 'approved' },
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
      distinct: true
    });

    const propertiesWithStats = properties.map(property => {
      const reviews = property.reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      return {
        ...property.toJSON(),
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length
      };
    });

    res.json({
      success: true,
      data: {
        properties: propertiesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        {
          association: 'reviews',
          where: { status: 'approved' },
          required: false,
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'avatar']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.increment('viewCount');

    const reviews = property.reviews || [];
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const ratingBreakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    let isSaved = false;
    if (req.user) {
      const savedProperty = await SavedProperty.findOne({
        where: {
          userId: req.user.id,
          propertyId: id
        }
      });
      isSaved = !!savedProperty;
    }

    res.json({
      success: true,
      data: {
        property: {
          ...property.toJSON(),
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
          ratingBreakdown,
          isSaved
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

export const createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };
    
    // Parse JSON stringified arrays from FormData
    if (propertyData.houseRules && typeof propertyData.houseRules === 'string') {
      propertyData.houseRules = JSON.parse(propertyData.houseRules);
    }
    if (propertyData.amenities && typeof propertyData.amenities === 'string') {
      propertyData.amenities = JSON.parse(propertyData.amenities);
    }
    
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => `/uploads/properties/${file.filename}`);
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse JSON stringified arrays from FormData
    if (updateData.houseRules && typeof updateData.houseRules === 'string') {
      updateData.houseRules = JSON.parse(updateData.houseRules);
    }
    if (updateData.amenities && typeof updateData.amenities === 'string') {
      updateData.amenities = JSON.parse(updateData.amenities);
    }

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/properties/${file.filename}`);
      updateData.images = [...(property.images || []), ...newImages];
    }

    await property.update(updateData);

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.destroy();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

export const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.findAll({
      where: {
        isFeatured: true,
        isAvailable: true,
        status: 'active'
      },
      include: [
        {
          association: 'reviews',
          attributes: ['rating'],
          where: { status: 'approved' },
          required: false
        }
      ],
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const propertiesWithStats = properties.map(property => {
      const reviews = property.reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      return {
        ...property.toJSON(),
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length
      };
    });

    res.json({
      success: true,
      data: { properties: propertiesWithStats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured properties',
      error: error.message
    });
  }
};

export const getPropertyStats = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        {
          association: 'bookings',
          attributes: ['status', 'totalAmount', 'createdAt']
        },
        {
          association: 'reviews',
          attributes: ['rating', 'createdAt'],
          where: { status: 'approved' },
          required: false
        }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const bookings = property.bookings || [];
    const reviews = property.reviews || [];

    const stats = {
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      totalRevenue: bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0),
      avgRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      totalReviews: reviews.length,
      viewCount: property.viewCount
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property stats',
      error: error.message
    });
  }
};