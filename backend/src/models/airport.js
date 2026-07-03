const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airport = sequelize.define('Airport', {
  AirportID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  IATACode: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    unique: true,
  },
  AirportName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  City: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Timezone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  GateNo: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  Terminal: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  RegionCode: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  HasCustoms: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  ConnectionCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  SlotCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'airport',
  timestamps: false,
});

module.exports = Airport;
