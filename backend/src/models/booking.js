const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  BookingID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  PNR: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  BookingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  Channel: {
    type: DataTypes.ENUM('WEB', 'MOBILE', 'AGENT', 'API'),
    allowNull: false,
    defaultValue: 'WEB',
  },
  Status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  PassengerID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'passenger',
      key: 'PassengerID'
    }
  },
  FlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  CabinClass: {
    type: DataTypes.ENUM('ECONOMY', 'BUSINESS', 'FIRST'),
    allowNull: false,
    defaultValue: 'ECONOMY',
  },
  Passengers: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of passenger details for Phase 1',
  },
  Seats: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of selected seat numbers',
  },
  ContactEmail: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  ContactPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Currency: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: 'USD',
  },
  ReturnFlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
}, {
  tableName: 'booking',
  timestamps: true,
  indexes: [
    {
      name: 'idx_booking_flight',
      fields: ['FlightID', 'Status'],
    },
    {
      name: 'idx_booking_pnr',
      fields: ['PNR'],
    },
    {
      name: 'idx_booking_passenger',
      fields: ['PassengerID', 'Status', 'BookingDate'],
    },
  ],
});

module.exports = Booking;
