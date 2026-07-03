const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CabinCrew extends Model {}

CabinCrew.init({
  CrewID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'crew',
      key: 'CrewID'
    },
    onDelete: 'CASCADE'
  },
  ServiceRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.00
  },
  Languages: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CabinCrew',
  tableName: 'cabin_crew',
  timestamps: false
});

module.exports = CabinCrew;
