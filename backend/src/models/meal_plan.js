const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class MealPlan extends Model {}

MealPlan.init({
  MealPlanID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  MealType: {
    type: DataTypes.ENUM('STANDARD', 'VEGETARIAN', 'VEGAN', 'HALAL', 'KOSHER', 'GLUTEN_FREE', 'DIABETIC'),
    allowNull: false,
    unique: true
  },
  DietaryInfo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Cost: {
    type: DataTypes.DECIMAL(6, 2),
    defaultValue: 0.00
  }
}, {
  sequelize,
  modelName: 'MealPlan',
  tableName: 'meal_plan',
  timestamps: false,
});

module.exports = MealPlan;
