const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CargoEvent extends Model {}

CargoEvent.init({
  EventID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  CargoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'cargo',
      key: 'CargoID'
    }
  },
  Status: {
    type: DataTypes.ENUM('BOOKED', 'LOADED', 'IN_TRANSIT', 'DELIVERED', 'HELD'),
    allowNull: false
  },
  Location: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CargoEvent',
  tableName: 'cargo_events',
  timestamps: false
});

module.exports = CargoEvent;
