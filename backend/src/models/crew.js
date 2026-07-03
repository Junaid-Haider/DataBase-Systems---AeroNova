const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Employee = require('./employee');

class Crew extends Model {}

Crew.init({
  CrewID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'employee',
      key: 'EmployeeID'
    },
    onDelete: 'CASCADE'
  },
  Role: {
    type: DataTypes.ENUM('PILOT', 'CO-PILOT', 'PURSER', 'FLIGHT_ATTENDANT'),
    allowNull: false
  },
  LicenseNo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  MedCertExp: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Crew',
  tableName: 'crew',
  timestamps: false
});

module.exports = Crew;
