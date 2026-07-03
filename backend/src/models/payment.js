const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Payment extends Model {}

Payment.init({
  PaymentID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
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
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  PayDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  PaymentMethod: {
    type: DataTypes.ENUM('CARD', 'WALLET', 'MILES'),
    allowNull: false
  },
  WalletProvider: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  CardType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Last4Digits: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  MilesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  IdempotencyKey: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payment',
  timestamps: true,
  indexes: [
    { fields: ['BookingID', 'Status'] },
    { fields: ['IdempotencyKey'] }
  ]
});

module.exports = Payment;
