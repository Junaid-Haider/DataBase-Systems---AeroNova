const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Employee extends Model {}

Employee.init({
  EmployeeID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'person',
      key: 'PersonID'
    },
    onDelete: 'CASCADE'
  },
  Role: {
    type: DataTypes.ENUM('ADMIN', 'AGENT', 'CREW', 'PILOT', 'MANAGER'),
    allowNull: false
  },
  HireDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'employee',
  timestamps: true,
});

module.exports = Employee;
