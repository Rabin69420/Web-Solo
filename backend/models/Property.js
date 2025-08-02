import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  pricePerRoom: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  propertyType: {
    type: DataTypes.ENUM('Apartment', 'Villa', 'House', 'Condo', 'Studio', 'Mansion', 'Penthouse'),
    allowNull: false
  },
  accommodationType: {
    type: DataTypes.ENUM('whole_house', 'whole_apartment', 'whole_flat', 'single_room', 'multiple_rooms'),
    allowNull: false,
    defaultValue: 'whole_apartment'
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0,
      max: 20
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 20
    }
  },
  maxOccupancy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    validate: {
      min: 1,
      max: 50
    }
  },
  minRooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  maxRooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  houseRules: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending', 'suspended'),
    defaultValue: 'active'
  },
  host: {
    type: DataTypes.JSONB,
    defaultValue: {
      name: '',
      phone: '',
      email: ''
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coordinates: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      lat: null,
      lng: null
    }
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bookingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'properties',
  timestamps: true,
  indexes: [
    {
      fields: ['location']
    },
    {
      fields: ['propertyType']
    },
    {
      fields: ['price']
    },
    {
      fields: ['isAvailable']
    },
    {
      fields: ['isFeatured']
    }
  ]
});

export default Property;