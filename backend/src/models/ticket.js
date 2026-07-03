const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Ticket extends Model {}

Ticket.init({
  TicketNo: {
    type: DataTypes.STRING(20),
    primaryKey: true // Format: AX-YEAR-NNNNN
  },
  BookingID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'booking',
      key: 'BookingID'
    },
    onDelete: 'CASCADE'
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
    allowNull: true,
    references: {
      model: 'flight',
      key: 'FlightID'
    }
  },
  SeatNo: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  CabinClass: {
    type: DataTypes.ENUM('ECONOMY', 'BUSINESS', 'FIRST'),
    allowNull: false
  },
  BaseFare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  Taxes: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  Fees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Currency: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  BaggageAllw: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 23
  },
  LoungeAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  FlatBed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  SuiteNo: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  PrivateDining: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  CheckedIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  CheckInTime: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Ticket',
  tableName: 'ticket',
  timestamps: true
});

module.exports = Ticket;
