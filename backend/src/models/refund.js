const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Refund extends Model {}

Refund.init({
  RefundID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  PaymentID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'payment',
      key: 'PaymentID'
    },
    onDelete: 'CASCADE'
  },
  RefundAmt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  RefundDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Reason: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Refund',
  tableName: 'refund',
  timestamps: true
});

module.exports = Refund;
