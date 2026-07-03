const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Baggage extends Model {}

Baggage.init({
  BaggageID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  TicketNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'ticket',
      key: 'TicketNo'
    },
    onDelete: 'CASCADE'
  },
  TagNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  BaggageType: {
    type: DataTypes.ENUM('CABIN', 'CHECKED', 'OVERSIZE'),
    allowNull: false
  },
  WeightKg: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  MaxDimCm: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  HoldSection: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  LoadOrder: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  OverFee: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0
  },
  HandlingNote: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Status: {
    type: DataTypes.ENUM('CHECKED_IN', 'LOADED', 'IN_TRANSIT', 'DELIVERED', 'LOST'),
    defaultValue: 'CHECKED_IN'
  }
}, {
  sequelize,
  modelName: 'Baggage',
  tableName: 'baggage',
  timestamps: true,
  indexes: [
    { fields: ['TagNumber'] },
    { fields: ['TicketNo'] }
  ]
});

module.exports = Baggage;
