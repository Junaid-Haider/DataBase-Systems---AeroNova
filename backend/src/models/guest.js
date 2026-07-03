const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Guest extends Model {}

Guest.init({
  GuestToken: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  BookingID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true, // Will be set after booking is created
  },
  Email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Guest',
  tableName: 'guest',
  timestamps: true,
});

module.exports = Guest;
