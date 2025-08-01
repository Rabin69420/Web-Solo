const User = require("../model/User");
const Property = require("../model/Property");
const { Op } = require("sequelize");

// Get admin dashboard statistics (matches your AdminDashboard)
const getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.count({ where: { role: 'user' } });
    const activeUsers = await User.count({ 
      where: { 
        role: 'user',
        isActive: true 
      } 
    });
    const suspendedUsers = await User.count({ 
      where: { 
        role: 'user',
        isActive: false 
      } 
    });

    // Property statistics
    const totalProperties = await Property.count();
    const availableProperties = await Property.count({ 
      where: { status: 'Available' } 
    });
    const rentedProperties = await Property.count({ 
      where: { status: 'Occupied' } // Using 'Occupied' to match your frontend
    });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.count({
      where: {
        role: 'user',
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    const recentProperties = await Property.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalProperties,
        availableProperties,
        rentedProperties,
        insights: {
          recentUsers,
          recentProperties,
          userGrowthRate: totalUsers > 0 ? ((recentUsers / totalUsers) * 100).toFixed(1) : 0,
          propertyGrowthRate: totalProperties > 0 ? ((recentProperties / totalProperties) * 100).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving dashboard statistics"
    });
  }
};

// Get all users for admin (matches your AdminUsers component)
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = { role: 'user' }; // Only get regular users, not admins
    
    // Search functionality (matches your frontend)
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        whereClause.isActive = true;
      } else if (status === 'suspended') {
        whereClause.isActive = false;
      }
    }

    const { rows: users, count } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      attributes: { exclude: ['password'] }
    });

    // Transform data to match your frontend format
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || '+1 (555) 000-0000', // Default if phone not in model
      status: user.isActive ? 'active' : 'suspended',
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`, // Default avatar
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      createdAt: user.createdAt,
      isActive: user.isActive
    }));

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: transformedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          hasNextPage: page < Math.ceil(count / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving users"
    });
  }
};

// Toggle user status (suspend/activate) - matches your frontend toggle
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot modify admin user status"
      });
    }

    // Toggle the status
    const newStatus = !user.isActive;
    await user.update({ isActive: newStatus });

    return res.status(200).json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'suspended'} successfully`,
      data: { 
        user: { 
          ...user.toJSON(), 
          password: undefined,
          status: newStatus ? 'active' : 'suspended'
        } 
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error updating user status"
    });
  }
};

// Update user status (alternative method)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot modify admin user status"
      });
    }

    await user.update({ isActive });

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'suspended'} successfully`,
      data: { 
        user: { 
          ...user.toJSON(), 
          password: undefined 
        } 
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error updating user status"
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin user"
      });
    }

    // Check if user has properties
    const userProperties = await Property.count({ where: { ownerId: id } });
    
    if (userProperties > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with existing properties. Please transfer or remove their properties first."
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting user"
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  updateUserStatus,
  deleteUser
};
