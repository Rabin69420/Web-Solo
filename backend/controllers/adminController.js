import { Op } from 'sequelize';
import { User, Property, Booking, Review, SavedProperty } from '../models/index.js';
import sequelize from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, role, accountType } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) where.status = status;
    if (role) where.role = role;
    if (accountType) where.accountType = accountType;

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        {
          association: 'bookings',
          attributes: ['id', 'status', 'totalAmount'],
          limit: 5,
          order: [['createdAt', 'DESC']]
        },
        {
          association: 'savedProperties',
          attributes: ['id']
        },
        {
          association: 'reviews',
          attributes: ['id', 'rating']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const usersWithStats = users.map(user => {
      const bookings = user.bookings || [];
      const reviews = user.reviews || [];
      const savedProperties = user.savedProperties || [];
      
      const totalSpent = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...user.toJSON(),
        statistics: {
          totalBookings: bookings.length,
          totalSpent,
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length,
          savedPropertiesCount: savedProperties.length
        }
      };
    });

    res.json({
      success: true,
      data: {
        users: usersWithStats,
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
      message: 'Error fetching users',
      error: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          association: 'bookings',
          include: [
            {
              association: 'property',
              attributes: ['id', 'title', 'location']
            }
          ],
          order: [['createdAt', 'DESC']]
        },
        {
          association: 'savedProperties',
          include: [
            {
              association: 'property',
              attributes: ['id', 'title', 'location', 'price']
            }
          ]
        },
        {
          association: 'reviews',
          include: [
            {
              association: 'property',
              attributes: ['id', 'title']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookings = user.bookings || [];
    const reviews = user.reviews || [];
    const savedProperties = user.savedProperties || [];
    
    const totalSpent = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);
    
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const userWithStats = {
      ...user.toJSON(),
      statistics: {
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalSpent,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        savedPropertiesCount: savedProperties.length
      }
    };

    res.json({
      success: true,
      data: { user: userWithStats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, accountType, verified } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify other admin accounts'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (accountType) updateData.accountType = accountType;
    if (verified !== undefined) updateData.verified = verified;

    await user.update(updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin accounts'
      });
    }

    const activeBookings = await Booking.count({
      where: {
        userId: id,
        status: { [Op.in]: ['pending', 'confirmed'] }
      }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active bookings'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const activeUsers = await User.count({ where: { role: 'user', status: 'active' } });
    const totalProperties = await Property.count();
    const activeProperties = await Property.count({ where: { isAvailable: true } });
    const totalBookings = await Booking.count();
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const totalReviews = await Review.count();
    const pendingReviews = await Review.count({ where: { status: 'pending' } });

    const totalRevenue = await Booking.sum('totalAmount', {
      where: { status: { [Op.in]: ['confirmed', 'completed'] } }
    });

    const monthlyRevenue = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookings']
      ],
      where: {
        status: { [Op.in]: ['confirmed', 'completed'] },
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    const topProperties = await Property.findAll({
      attributes: [
        'id', 'title', 'location', 'bookingCount', 'viewCount',
        [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'reviewCount']
      ],
      include: [
        {
          association: 'reviews',
          attributes: [],
          where: { status: 'approved' },
          required: false
        }
      ],
      group: ['Property.id'],
      order: [['bookingCount', 'DESC']],
      limit: 5,
      raw: true
    });

    const recentBookings = await Booking.findAll({
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          association: 'property',
          attributes: ['id', 'title', 'location']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        stats: {
          users: {
            total: totalUsers,
            active: activeUsers
          },
          properties: {
            total: totalProperties,
            active: activeProperties
          },
          bookings: {
            total: totalBookings,
            pending: pendingBookings
          },
          reviews: {
            total: totalReviews,
            pending: pendingReviews
          },
          revenue: {
            total: totalRevenue || 0,
            monthly: monthlyRevenue
          }
        },
        topProperties,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const admin = await User.create({
      name,
      email,
      password,
      phone,
      role: 'admin',
      status: 'active',
      verified: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { admin }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: error.message
    });
  }
};

export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = await sequelize.authenticate()
      .then(() => 'connected')
      .catch(() => 'disconnected');

    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        status: 'healthy',
        database: dbStatus,
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking system health',
      error: error.message
    });
  }
};