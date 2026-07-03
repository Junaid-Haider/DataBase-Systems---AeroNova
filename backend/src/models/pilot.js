const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Pilot extends Model {}

Pilot.init({
  CrewID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'crew',
      key: 'CrewID'
    },
    onDelete: 'CASCADE'
  },
  AircraftRating: {
    type: DataTypes.STRING(100), // e.g., "B777, A350"
    allowNull: true
  },
  TotalHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Rank: {
    type: DataTypes.ENUM('CAPTAIN', 'FIRST_OFFICER', 'SECOND_OFFICER'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Pilot',
  tableName: 'pilot',
  timestamps: false
});

module.exports = Pilot;
