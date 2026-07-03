const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class RefreshToken extends Model {}

RefreshToken.init({
  TokenID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  PersonID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'person',
      key: 'PersonID'
    },
    onDelete: 'CASCADE'
  },
  TokenJTI: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  ExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_token',
  timestamps: true,
});

module.exports = RefreshToken;
