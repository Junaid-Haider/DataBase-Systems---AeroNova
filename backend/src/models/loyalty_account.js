const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class LoyaltyAccount extends Model {}

LoyaltyAccount.init({
  AccountID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  FFID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: {
      model: 'frequent_flyer',
      key: 'FFID'
    },
    onDelete: 'CASCADE'
  },
  BonusMult: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.00
  },
  LoungePass: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  UpgradeCred: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ConciergeAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  GlobalLoungeAccess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'LoyaltyAccount',
  tableName: 'loyalty_account',
  timestamps: true,
});

module.exports = LoyaltyAccount;
