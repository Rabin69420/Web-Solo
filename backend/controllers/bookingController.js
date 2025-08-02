import { Op } from 'sequelize';
import { Booking, Property, User } from '../models/index.js';

export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      startDate,
      endDate,
      guests,
      rooms,
      totalAmount,
      specialRequests,
      contactInfo
    } = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (!property.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      });
    }

    if (guests > property.maxOccupancy) {
      return res.status(400).json({
        success: false,
        message: `Property can accommodate maximum ${property.maxOccupancy} guests`
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    const conflictingBooking = await Booking.findOne({
      where: {
        propertyId,
        status: { [Op.in]: ['pending', 'confirmed'] },
        [Op.or]: [
          {
            startDate: { [Op.between]: [start, end] }
          },
          {
            endDate: { [Op.between]: [start, end] }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: start } },
              { endDate: { [Op.gte]: end } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Property is already booked for the selected dates'
      });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      propertyId,
      startDate,
      endDate,
      guests,
      rooms,
      totalAmount,
      specialRequests,
      contactInfo: {
        phone: contactInfo?.phone || req.user.phone,
        email: contactInfo?.email || req.user.email,
        emergencyContact: contactInfo?.emergencyContact || ''
      }
    });

    await property.increment('bookingCount');

    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          association: 'property',
          attributes: ['id', 'title', 'location', 'images']
        },
        {
          association: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: bookingWithDetails }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        {
          association: 'property',
          attributes: ['id', 'title', 'location', 'images', 'propertyType']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        bookings,
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
      message: 'Error fetching user bookings',
      error: error.message
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, propertyId, userId } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        {
          association: 'property',
          attributes: ['id', 'title', 'location', 'images', 'propertyType']
        },
        {
          association: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        bookings,
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
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const where = { id };

    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const booking = await Booking.findOne({
      where,
      include: [
        {
          association: 'property',
          include: [
            {
              association: 'reviews',
              where: { userId: req.user.id },
              required: false
            }
          ]
        },
        {
          association: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;

    await booking.update(updateData);

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          association: 'property',
          attributes: ['id', 'title', 'location']
        },
        {
          association: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking: updatedBooking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const where = { id };

    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const booking = await Booking.findOne({ where });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    await booking.update({
      status: 'cancelled',
      cancellationReason
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });
    const completedBookings = await Booking.count({ where: { status: 'completed' } });

    const totalRevenue = await Booking.sum('totalAmount', {
      where: { status: { [Op.in]: ['confirmed', 'completed'] } }
    });

    const monthlyBookings = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          completedBookings,
          totalRevenue: totalRevenue || 0
        },
        monthlyBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking stats',
      error: error.message
    });
  }
};