const Property = require("../model/Property");
const User = require("../model/User");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get all properties with advanced filtering (matches your frontend)
const getAllProperties = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      status,
      type,
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    let whereClause = { isActive: true };
    
    // Search functionality (matches your frontend search)
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Status filter
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    // Type filter
    if (type && type !== 'all') {
      whereClause.type = type;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    const { rows: properties, count } = await Property.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    return res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalProperties: count,
          hasNextPage: page < Math.ceil(count / limit),
          hasPrevPage: page > 1
        },
        stats: {
          total: count,
          available: await Property.count({ where: { ...whereClause, status: 'Available' } }),
          occupied: await Property.count({ where: { ...whereClause, status: 'Occupied' } }),
          maintenance: await Property.count({ where: { ...whereClause, status: 'Maintenance' } })
        }
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving properties"
    });
  }
};

// Create new property (matches your AddProperty component)
const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const {
      title,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      maxOccupancy,
      description,
      image,
      houseRules
    } = req.body;

    // Get ownerId from authenticated user (admin can create properties)
    const ownerId = req.user.id;

    const property = await Property.create({
      title: title.trim(),
      location: location.trim(),
      price: parseFloat(price),
      type,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      maxOccupancy: parseInt(maxOccupancy),
      description: description.trim(),
      image: image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300',
      images: image ? [image] : [],
      houseRules: houseRules && houseRules.length > 0 ? houseRules : ['No specific rules'],
      ownerId,
      status: 'Available'
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: { property }
    });
  } catch (error) {
    console.error('Create property error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error creating property"
    });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const property = await Property.findByPk(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Admin can update any property
    if (req.user.role !== 'admin' && property.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this property"
      });
    }

    const updatedProperty = await property.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: { property: updatedProperty }
    });
  } catch (error) {
    console.error('Update property error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error updating property"
    });
  }
};

// Toggle property status (matches your frontend toggle functionality)
const togglePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Toggle between Available and Occupied
    const newStatus = property.status === 'Available' ? 'Occupied' : 'Available';
    
    await property.update({ status: newStatus });

    return res.status(200).json({
      success: true,
      message: `Property marked as ${newStatus}`,
      data: { property }
    });
  } catch (error) {
    console.error('Toggle property status error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error updating property status"
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Admin can delete any property
    if (req.user.role !== 'admin' && property.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this property"
      });
    }

    await property.destroy();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    console.error('Delete property error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting property"
    });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Increment view count
    await property.increment('viewCount');

    return res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: { property }
    });
  } catch (error) {
    console.error('Get property error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving property"
    });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyStatus
};
