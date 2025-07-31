const { Sequelize } = require("sequelize");
require("dotenv").config();

// Debug logging to see what's being loaded
console.log('🔍 Database Configuration Debug:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 20000,
    },
    retry: {
      max: 3
    }
  },
);

// Enhanced test connection function
const testConnection = async () => {
  try {
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    console.log(`🗄️  Connected to database: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    console.error("Full error details:", error);
    console.error("💡 Please check your database credentials and ensure PostgreSQL is running");
    process.exit(1);
  }
};

const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log("🔒 Database connection closed successfully");
  } catch (error) {
    console.error("❌ Error closing database connection:", error.message);
  }
};

module.exports = { sequelize, testConnection, closeConnection };
