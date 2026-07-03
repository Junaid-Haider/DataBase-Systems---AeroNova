const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class NotificationLog extends Model {}

NotificationLog.init({
  LogID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  PassengerID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'passenger',
      key: 'PassengerID'
    }
  },
  Type: {
    type: DataTypes.ENUM('EMAIL_VERIFY', 'BOOKING_CONFIRM', 'TICKET_PDF', 'REFUND', 'LOST_BAGGAGE', 'PASSWORD_RESET'),
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  SentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Error: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'NotificationLog',
  tableName: 'notification_log',
  timestamps: false
});

module.exports = NotificationLog;
