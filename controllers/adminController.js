const { User, Schedule, PatientCard } = require('../models');

module.exports = {
  grantAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      user.role = 'admin';
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteDoctor: async (req, res) => {
    try {
      const doctor = await User.findByPk(req.params.doctorId);
      if (!doctor || doctor.role !== 'doctor') {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      await doctor.destroy();
      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  createSchedule: async (req, res) => {
    try {
      const doctor = await User.findByPk(req.params.doctorId);
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

      const schedule = await Schedule.create({
        ...req.body,
        doctorId: req.params.doctorId
      });
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.scheduleId);
      if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

      await schedule.destroy();
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

    listDoctors: async (req, res) => {
    try {
      const doctors = await User.findAll({
        where: { role: 'doctor' },
        attributes: ['id', 'email', 'createdAt']
      });
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listPatients: async (req, res) => {
    try {
      const patients = await PatientCard.findAll({
        include: [{
          model: User,
          attributes: ['id', 'email'],
          as: 'Doctor'
        }]
      });
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  updateSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.scheduleId);
      if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
      
      await schedule.update(req.body);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
