import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedProperty = sequelize.define('SavedProperty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'properties',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'saved_properties',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'propertyId']
    }
  ]
});

export default SavedProperty;