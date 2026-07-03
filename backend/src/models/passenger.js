const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Passenger extends Model {}

Passenger.init({
  PassengerID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: 'person',
      key: 'PersonID'
    },
    onDelete: 'CASCADE'
  },
  PassportNo: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  MealPlanID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'meal_plan',
      key: 'MealPlanID'
    }
  }
}, {
  sequelize,
  modelName: 'Passenger',
  tableName: 'passenger',
  timestamps: false,
});

module.exports = Passenger;
