const { DataTypes } = require("sequelize");
const { sequelize } = require("../viable/db");

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 200],
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    type: {
      type: DataTypes.ENUM('apartment', 'house', 'studio', 'room'),
      allowNull: false,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    maxOccupancy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 20,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT, // Store base64 image or URL
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON, // Array of image URLs
      defaultValue: [],
    },
    houseRules: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    // Updated status to match your frontend
    status: {
      type: DataTypes.ENUM('Available', 'Occupied', 'Maintenance', 'Pending'),
      defaultValue: 'Available',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    featuredUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "properties",
    timestamps: true,
    indexes: [
      { fields: ['location'] },
      { fields: ['type'] },
      { fields: ['price'] },
      { fields: ['status'] },
      { fields: ['ownerId'] },
    ],
  }
);

module.exports = Property;
