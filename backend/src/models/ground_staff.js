const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class GroundStaff extends Model {}

GroundStaff.init({
  EmployeeID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'employee',
      key: 'EmployeeID'
    },
    onDelete: 'CASCADE'
  },
  ShiftType: {
    type: DataTypes.ENUM('MORNING', 'EVENING', 'NIGHT'),
    allowNull: false
  },
  Terminal: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'GroundStaff',
  tableName: 'ground_staff',
  timestamps: false
});

module.exports = GroundStaff;
