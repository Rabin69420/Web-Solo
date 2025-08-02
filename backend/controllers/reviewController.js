import { Op } from 'sequelize';
import { Review, Booking, Property, User } from '../models/index.js';

export const createReview = async (req, res) => {
  try {
    const {
      propertyId,
      bookingId,
      rating,
      title,
      comment,
      pros,
      cons,
      cleanliness,
      communication,
      location,
      value,
      wouldRecommend
    } = req.body;

    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId: req.user.id,
        propertyId,
        status: 'completed'
      }
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review properties you have completed bookings for'
      });
    }

    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        bookingId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      propertyId,
      bookingId,
      rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      cleanliness,
      communication,
      location,
      value,
      wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : true
    });

    const reviewWithDetails = await Review.findByPk(review.id, {
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'avatar']
        },
        {
          association: 'property',
          attributes: ['id', 'title', 'location']
        },
        {
          association: 'booking',
          attributes: ['id', 'startDate', 'endDate']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review: reviewWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

export const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      propertyId,
      status: 'approved'
    };

    if (rating) {
      where.rating = rating;
    }

    let order = [['createdAt', 'DESC']];
    if (sortBy === 'oldest') {
      order = [['createdAt', 'ASC']];
    } else if (sortBy === 'highest_rating') {
      order = [['rating', 'DESC'], ['createdAt', 'DESC']];
    } else if (sortBy === 'lowest_rating') {
      order = [['rating', 'ASC'], ['createdAt', 'DESC']];
    } else if (sortBy === 'helpful') {
      order = [['helpfulCount', 'DESC'], ['createdAt', 'DESC']];
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    const property = await Property.findByPk(propertyId, {
      attributes: ['id', 'title']
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const avgRating = await Review.findOne({
      where: { propertyId, status: 'approved' },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
      ],
      raw: true
    });

    const ratingBreakdown = await Review.findAll({
      where: { propertyId, status: 'approved' },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'DESC']],
      raw: true
    });

    const breakdown = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    ratingBreakdown.forEach(item => {
      breakdown[item.rating] = parseInt(item.count);
    });

    res.json({
      success: true,
      data: {
        reviews,
        property,
        stats: {
          avgRating: avgRating.avgRating ? Math.round(avgRating.avgRating * 10) / 10 : 0,
          totalReviews: parseInt(avgRating.totalReviews) || 0,
          ratingBreakdown: breakdown
        },
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
      message: 'Error fetching property reviews',
      error: error.message
    });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          association: 'property',
          attributes: ['id', 'title', 'location', 'images']
        },
        {
          association: 'booking',
          attributes: ['id', 'startDate', 'endDate']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        reviews,
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
      message: 'Error fetching user reviews',
      error: error.message
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, propertyId, userId, rating } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (rating) where.rating = rating;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          association: 'property',
          attributes: ['id', 'title', 'location']
        },
        {
          association: 'booking',
          attributes: ['id', 'startDate', 'endDate']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        reviews,
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
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const updateData = { status };
    if (adminResponse) updateData.adminResponse = adminResponse;

    await review.update(updateData);

    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          association: 'property',
          attributes: ['id', 'title']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Review status updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
      error: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const where = { id };

    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const review = await Review.findOne({ where });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

export const getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.count();
    const pendingReviews = await Review.count({ where: { status: 'pending' } });
    const approvedReviews = await Review.count({ where: { status: 'approved' } });
    const rejectedReviews = await Review.count({ where: { status: 'rejected' } });

    const avgRating = await Review.findOne({
      where: { status: 'approved' },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });

    const ratingDistribution = await Review.findAll({
      where: { status: 'approved' },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'DESC']],
      raw: true
    });

    const distribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    ratingDistribution.forEach(item => {
      distribution[item.rating] = parseInt(item.count);
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalReviews,
          pendingReviews,
          approvedReviews,
          rejectedReviews,
          avgRating: avgRating.avgRating ? Math.round(avgRating.avgRating * 10) / 10 : 0,
          ratingDistribution: distribution
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review stats',
      error: error.message
    });
  }
};