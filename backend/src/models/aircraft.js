const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aircraft = sequelize.define('Aircraft', {
  AircraftID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  RegNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  Model: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  Capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  Status: {
    type: DataTypes.ENUM('ACTIVE', 'MAINTENANCE', 'RETIRED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  MfgYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NumAisles: {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
  MaxSeats: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CargoVol_m3: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  MaxPayload_kg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  AircraftType: {
    type: DataTypes.ENUM('WIDE-BODY', 'NARROW-BODY'),
    allowNull: false,
  },
  // Seat configuration stored as JSON for seat map generation
  SeatConfig: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON seat layout config: { FIRST: {rows, seatsPerRow, label}, BUSINESS: {...}, ECONOMY: {...} }',
  },
}, {
  tableName: 'aircraft',
  timestamps: false,
});

module.exports = Aircraft;
