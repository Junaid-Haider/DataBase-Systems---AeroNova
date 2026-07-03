const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class FrequentFlyer extends Model {}

FrequentFlyer.init({
  FFID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  PassengerID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: {
      model: 'passenger',
      key: 'PassengerID'
    },
    onDelete: 'CASCADE'
  },
  EnrollDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  MilesBalance: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  TierLevel: {
    type: DataTypes.ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM'),
    defaultValue: 'BRONZE'
  }
}, {
  sequelize,
  modelName: 'FrequentFlyer',
  tableName: 'frequent_flyer',
  timestamps: true,
});

module.exports = FrequentFlyer;
