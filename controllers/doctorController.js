const { Schedule, PatientCard } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  getSchedules: async (req, res) => {
    try {
      const { date } = req.query;
      const where = { doctorId: req.user.id };
      
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        where.date = {
          [Op.between]: [startDate, endDate]
        };
      }

      const schedules = await Schedule.findAll({ where });
      res.json(schedules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getPatientCards: async (req, res) => {
    try {
      const patientCards = await PatientCard.findAll({
        where: { doctorId: req.user.id }
      });
      res.json(patientCards);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  createPatientCard: async (req, res) => {
    try {
      const card = await PatientCard.create({
        ...req.body,
        doctorId: req.user.id
      });
      res.json(card);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updatePatientCard: async (req, res) => {
    try {
      const card = await PatientCard.findOne({
        where: {
          id: req.params.cardId,
          doctorId: req.user.id
        }
      });
      
      if (!card) return res.status(404).json({ error: 'Patient card not found' });
      
      await card.update(req.body);
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletePatientCard: async (req, res) => {
    try {
      const card = await PatientCard.findOne({
        where: {
          id: req.params.cardId,
          doctorId: req.user.id
        }
      });
      
      if (!card) return res.status(404).json({ error: 'Patient card not found' });
      
      await card.destroy();
      res.json({ message: 'Patient card deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
