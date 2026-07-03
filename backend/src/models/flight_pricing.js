const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class FlightPricing extends Model {}

FlightPricing.init({
  PricingID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  FlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'flight',
      key: 'FlightID'
    }
  },
  CabinClass: {
    type: DataTypes.ENUM('ECONOMY', 'BUSINESS', 'FIRST'),
    allowNull: false
  },
  BasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 }
  },
  SeatsAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Currency: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  LastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'FlightPricing',
  tableName: 'flight_pricing',
  timestamps: false,
  indexes: [
    {
      unique: true,
      name: 'uq_flight_cabin',
      fields: ['FlightID', 'CabinClass']
    }
  ]
});

module.exports = FlightPricing;
