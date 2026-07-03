const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class BaggageEvent extends Model {}

BaggageEvent.init({
  EventID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  BaggageID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'baggage',
      key: 'BaggageID'
    }
  },
  Status: {
    type: DataTypes.ENUM('CHECKED_IN', 'LOADED', 'IN_TRANSIT', 'DELIVERED', 'LOST'),
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
  modelName: 'BaggageEvent',
  tableName: 'baggage_events',
  timestamps: false
});

module.exports = BaggageEvent;
