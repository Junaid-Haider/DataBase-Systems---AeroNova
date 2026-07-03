const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class FlightCrewAssignment extends Model {}

FlightCrewAssignment.init({
  FlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'flight',
      key: 'FlightID'
    },
    onDelete: 'CASCADE'
  },
  CrewID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'crew',
      key: 'CrewID'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'FlightCrewAssignment',
  tableName: 'flight_crew_assignment',
  timestamps: false,
  indexes: [
    { fields: ['FlightID'] }
  ]
});

module.exports = FlightCrewAssignment;
