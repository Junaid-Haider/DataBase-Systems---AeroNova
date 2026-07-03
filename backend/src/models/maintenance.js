const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Maintenance extends Model {}

Maintenance.init({
  MaintenID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  AircraftID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'aircraft',
      key: 'AircraftID'
    },
    onDelete: 'CASCADE'
  },
  Type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Status: {
    type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'),
    defaultValue: 'SCHEDULED'
  }
}, {
  sequelize,
  modelName: 'Maintenance',
  tableName: 'maintenance',
  timestamps: true
});

module.exports = Maintenance;
