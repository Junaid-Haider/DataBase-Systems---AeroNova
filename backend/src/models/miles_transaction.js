const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class MilesTransaction extends Model {}

MilesTransaction.init({
  TxID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  FFID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'frequent_flyer',
      key: 'FFID'
    }
  },
  Type: {
    type: DataTypes.ENUM('EARN', 'REDEEM', 'BONUS', 'EXPIRE'),
    allowNull: false
  },
  Miles: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  TicketNo: {
    type: DataTypes.STRING(20),
    allowNull: true,
    references: {
      model: 'ticket',
      key: 'TicketNo'
    }
  },
  BookingID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'booking',
      key: 'BookingID'
    }
  },
  TxDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'MilesTransaction',
  tableName: 'miles_transactions',
  timestamps: false
});

module.exports = MilesTransaction;
