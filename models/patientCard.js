const { DataTypes } = require('sequelize');
const db = require('../config/db');

const PatientCard = db.define('PatientCard', {
  patientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  treatment: DataTypes.TEXT,
  notes: DataTypes.TEXT
});

module.exports = PatientCard;
