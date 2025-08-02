import { SavedProperty, Property, Review } from '../models/index.js';

export const getSavedProperties = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: savedProperties } = await SavedProperty.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          association: 'property',
          include: [
            {
              association: 'reviews',
              attributes: ['rating'],
              where: { status: 'approved' },
              required: false
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const propertiesWithStats = savedProperties.map(savedProperty => {
      const property = savedProperty.property;
      const reviews = property.reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      return {
        id: savedProperty.id,
        savedAt: savedProperty.createdAt,
        notes: savedProperty.notes,
        property: {
          ...property.toJSON(),
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length
        }
      };
    });

    res.json({
      success: true,
      data: {
        savedProperties: propertiesWithStats,
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
      message: 'Error fetching saved properties',
      error: error.message
    });
  }
};

export const saveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { notes } = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const existingSavedProperty = await SavedProperty.findOne({
      where: {
        userId: req.user.id,
        propertyId
      }
    });

    if (existingSavedProperty) {
      return res.status(400).json({
        success: false,
        message: 'Property is already saved'
      });
    }

    const savedProperty = await SavedProperty.create({
      userId: req.user.id,
      propertyId,
      notes: notes || ''
    });

    const savedPropertyWithDetails = await SavedProperty.findByPk(savedProperty.id, {
      include: [
        {
          association: 'property',
          attributes: ['id', 'title', 'location', 'price', 'images']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Property saved successfully',
      data: { savedProperty: savedPropertyWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving property',
      error: error.message
    });
  }
};

export const unsaveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const savedProperty = await SavedProperty.findOne({
      where: {
        userId: req.user.id,
        propertyId
      }
    });

    if (!savedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property is not saved'
      });
    }

    await savedProperty.destroy();

    res.json({
      success: true,
      message: 'Property removed from saved list'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing saved property',
      error: error.message
    });
  }
};

export const updateSavedPropertyNotes = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { notes } = req.body;

    const savedProperty = await SavedProperty.findOne({
      where: {
        userId: req.user.id,
        propertyId
      }
    });

    if (!savedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property is not saved'
      });
    }

    await savedProperty.update({ notes });

    res.json({
      success: true,
      message: 'Notes updated successfully',
      data: { savedProperty }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notes',
      error: error.message
    });
  }
};

export const checkIfPropertySaved = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const savedProperty = await SavedProperty.findOne({
      where: {
        userId: req.user.id,
        propertyId
      }
    });

    res.json({
      success: true,
      data: {
        isSaved: !!savedProperty,
        savedProperty: savedProperty || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking saved status',
      error: error.message
    });
  }
};

export const getSavedPropertiesCount = async (req, res) => {
  try {
    const count = await SavedProperty.count({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching saved properties count',
      error: error.message
    });
  }
};