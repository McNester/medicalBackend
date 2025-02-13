const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const User = dbMock.define('User', {
  id: 1,
  email: 'doctor@example.com',
  role: 'doctor',
});

const Schedule = dbMock.define('Schedule', {
  id: 1,
  doctorId: 1,
  date: '2025-02-13',
});

const PatientCard = dbMock.define('PatientCard', {
  id: 1,
  userId: 1,
  diagnosis: 'Flu',
});

module.exports = { User, Schedule, PatientCard };

