const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.delete('/doctors/:doctorId', adminController.deleteDoctor);
router.post('/doctors/:doctorId/schedules', adminController.createSchedule);
router.get('/doctors', adminController.listDoctors);
router.get('/users', adminController.listUsers);

router.put('/users/:userId/role', adminController.grantAdmin);

router.put('/schedules/:scheduleId', adminController.updateSchedule);
router.delete('/schedules/:scheduleId', adminController.deleteSchedule);
router.put('/schedules/:scheduleId', adminController.updateSchedule);
router.delete('/schedules/:scheduleId', adminController.deleteSchedule);


router.get('/patients', adminController.listPatients);

module.exports = router;
