const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/schedules', doctorController.getSchedules);

router.get('/patient-cards', doctorController.getPatientCards);
router.post('/patient-cards', doctorController.createPatientCard);
router.put('/patient-cards/:cardId', doctorController.updatePatientCard);
router.delete('/patient-cards/:cardId', doctorController.deletePatientCard);

module.exports = router;
