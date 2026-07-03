const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cargo extends Model {}

Cargo.init({
  CargoID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  TrackingNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  FlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'flight',
      key: 'FlightID'
    },
    onDelete: 'CASCADE'
  },
  CargoType: {
    type: DataTypes.ENUM('STANDARD', 'PERISHABLE', 'HAZMAT'),
    allowNull: false,
    defaultValue: 'STANDARD'
  },
  WeightKg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  VolumeM3: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false
  },
  TempReq_C: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  HazClass: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  SenderName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  ReceiverName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('BOOKED', 'RECEIVED', 'LOADED', 'IN_TRANSIT', 'DELIVERED'),
    defaultValue: 'BOOKED'
  }
}, {
  sequelize,
  modelName: 'Cargo',
  tableName: 'cargo',
  timestamps: true,
  indexes: [
    { fields: ['TrackingNo'] },
    { fields: ['FlightID', 'Status'] }
  ]
});

module.exports = Cargo;
