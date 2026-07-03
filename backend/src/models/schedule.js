const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  SchedID: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  FlightID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  EffDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  DayOfWeek: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: { min: 1, max: 7 },
  },
  DepTime_Time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  DepTime_TimeZone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ArrTime_Time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  ArrTime_TimeZone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Frequency: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY'),
    allowNull: false,
  },
  Interval_days: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  SchedType: {
    type: DataTypes.ENUM('SCHEDULED', 'UNSCHEDULED'),
    allowNull: false,
    defaultValue: 'SCHEDULED',
  },
}, {
  tableName: 'schedule',
  timestamps: false,
  indexes: [
    {
      name: 'idx_schedule_flight',
      fields: ['FlightID', 'EffDate', 'DayOfWeek'],
    },
  ],
});

module.exports = Schedule;
