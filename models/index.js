const db = require('../config/db');
const User = require('./user');
const Schedule = require('./schedule');
const PatientCard = require('./patientCard');

User.hasMany(Schedule, { foreignKey: 'doctorId' });
Schedule.belongsTo(User, { foreignKey: 'doctorId' });

User.hasMany(PatientCard, { foreignKey: 'doctorId' });
PatientCard.belongsTo(User, {
  foreignKey: 'doctorId',
  as: 'Doctor'
});

module.exports = {
  db,
  User,
  Schedule,
  PatientCard
};
