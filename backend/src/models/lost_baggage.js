const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class LostBaggage extends Model {}

LostBaggage.init({
  LostReportID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  BaggageID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'baggage',
      key: 'BaggageID'
    },
    onDelete: 'CASCADE'
  },
  ReportDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  FoundDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CompensationAmt: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  Status: {
    type: DataTypes.ENUM('SEARCHING', 'FOUND', 'COMPENSATED'),
    defaultValue: 'SEARCHING'
  }
}, {
  sequelize,
  modelName: 'LostBaggage',
  tableName: 'lost_baggage',
  timestamps: true
});

module.exports = LostBaggage;
