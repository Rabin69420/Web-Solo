const path = require('path');
require('dotenv').config({ 
    path: path.resolve(__dirname, '..', '.env') 
});

const { sequelize } = require('../viable/db');
const User = require('../model/User.js');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    
    // Get admin credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin123@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123";
    
    // Display only email and password without box
    console.log(`📧 Email    : ${ADMIN_EMAIL}`);
    console.log(`🔑 Password : ${ADMIN_PASSWORD}`);
    
    // Check if admin already exists
    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log('⚠️  Admin already exists!');
      process.exit(0);
    }
    
    // Create admin user
    const timestamp = Date.now().toString();
    const alphanumericUsername = `admin${timestamp.slice(-6)}`;
    
    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      username: alphanumericUsername,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      gender: "other",
      role: "admin",
      isActive: true
    });
    
    console.log('✅ Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.log('❌ Error creating admin');
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
})();
