const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class AdminUser extends Model {}

AdminUser.init({
  AdminID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  EmployeeID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: {
      model: 'employee',
      key: 'EmployeeID'
    },
    onDelete: 'CASCADE'
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  AdminScope: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'ALL'
  },
  LastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'AdminUser',
  tableName: 'admin_users',
  timestamps: true
});

module.exports = AdminUser;
