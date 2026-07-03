const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flight = sequelize.define('Flight', {
  FlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  FlightNo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  DepDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('SCHEDULED', 'BOARDING', 'DEPARTED', 'ARRIVED', 'CANCELLED', 'DELAYED'),
    allowNull: false,
    defaultValue: 'SCHEDULED',
  },
  ActualDep: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ActualArr: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Duration_Hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
  Duration_Minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 59 },
  },
  FlightType: {
    type: DataTypes.ENUM('DOMESTIC', 'INTERNATIONAL', 'CHARTER'),
    allowNull: false,
  },
  AircraftID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  DepAirportID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  ArrAirportID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  OverflightPermit: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  CustomsRequired: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  AirspaceZone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  CharterOrgID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  GroupSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  IncidentRef: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Severity: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
    allowNull: true,
  },
  // Pricing stored as JSON for cabin classes
  BaseFare: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: { ECONOMY: 250, BUSINESS: 850, FIRST: 2200 },
    comment: 'Base fares per cabin class',
  },
}, {
  tableName: 'flight',
  timestamps: false,
  indexes: [
    {
      name: 'idx_flight_dep_arr_date',
      fields: ['DepAirportID', 'ArrAirportID', 'DepDate', 'Status'],
    },
    {
      name: 'idx_flight_status',
      fields: ['Status'],
    },
  ],
});

module.exports = Flight;
