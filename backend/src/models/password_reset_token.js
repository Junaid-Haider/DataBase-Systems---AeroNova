const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PasswordResetToken extends Model {}

PasswordResetToken.init({
  TokenID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  PassengerID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'passenger',
      key: 'PassengerID'
    }
  },
  Token: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Used: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'PasswordResetToken',
  tableName: 'password_reset_tokens',
  timestamps: false
});

module.exports = PasswordResetToken;
