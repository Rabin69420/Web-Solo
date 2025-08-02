import sequelize from '../config/database.js';
import User from './User.js';
import Property from './Property.js';
import Booking from './Booking.js';
import SavedProperty from './SavedProperty.js';
import Review from './Review.js';

User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'bookings'
});

Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Property.hasMany(Booking, {
  foreignKey: 'propertyId',
  as: 'bookings'
});

Booking.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property'
});

User.hasMany(SavedProperty, {
  foreignKey: 'userId',
  as: 'savedProperties'
});

SavedProperty.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Property.hasMany(SavedProperty, {
  foreignKey: 'propertyId',
  as: 'savedByUsers'
});

SavedProperty.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property'
});

User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Property.hasMany(Review, {
  foreignKey: 'propertyId',
  as: 'reviews'
});

Review.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property'
});

Booking.hasOne(Review, {
  foreignKey: 'bookingId',
  as: 'review'
});

Review.belongsTo(Booking, {
  foreignKey: 'bookingId',
  as: 'booking'
});

User.belongsToMany(Property, {
  through: SavedProperty,
  foreignKey: 'userId',
  otherKey: 'propertyId',
  as: 'favoriteProperties'
});

Property.belongsToMany(User, {
  through: SavedProperty,
  foreignKey: 'propertyId',
  otherKey: 'userId',
  as: 'favoritedByUsers'
});

export {
  sequelize,
  User,
  Property,
  Booking,
  SavedProperty,
  Review
};

export default {
  sequelize,
  User,
  Property,
  Booking,
  SavedProperty,
  Review
};