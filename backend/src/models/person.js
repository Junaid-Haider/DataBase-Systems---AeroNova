const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Person extends Model {}

Person.init({
  PersonID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  FirstName: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  FullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.FirstName} ${this.LastName}`;
    }
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT'),
    allowNull: false
  },
  Nationality: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  Phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false // Storing bcrypt hash
  },
  IsEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Person',
  tableName: 'person',
  timestamps: true,
});

module.exports = Person;
