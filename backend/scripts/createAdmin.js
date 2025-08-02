import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';
import { User } from '../models/index.js';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database
    await sequelize.sync();
    console.log('✅ Database synchronized successfully.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: {
        email: 'admin@rentapp.com'
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: admin@rentapp.com');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: 'admin123',
      phone: '+1234567890',
      address: 'System Address',
      role: 'admin',
      status: 'active',
      verified: true
    };

    const admin = await User.create(adminData);

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    console.log(`👤 Admin ID: ${admin.id}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('\n📖 Create Admin Script');
  console.log('========================');
  console.log('This script creates an admin user for the rental application.');
  console.log('\n🚀 Usage:');
  console.log('  node scripts/createAdmin.js');
  console.log('\n📝 Default Admin Credentials:');
  console.log('  Email: admin@rentapp.com');
  console.log('  Password: admin123');
  console.log('\n⚠️  Security Note:');
  console.log('  Please change the default password after first login!');
  process.exit(0);
}

// Run the script
console.log('🔧 Creating admin user...');
createAdmin();
