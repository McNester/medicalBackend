const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/admin');
const { User, Schedule } = require('../models');

jest.mock('../models');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Controller Tests', () => {

    test('Should delete a doctor successfully', async () => {
        const mockDoctor = {
            id: 1,
            role: 'doctor',
            destroy: jest.fn().mockResolvedValue(),
        };

        User.findByPk = jest.fn().mockResolvedValue(mockDoctor);

        const res = await request(app).delete('/admin/doctors/1');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Doctor deleted successfully');
        expect(mockDoctor.destroy).toHaveBeenCalled();
    });

    test('Should return 404 if doctor not found', async () => {
        User.findByPk.mockResolvedValue(null);

        const res = await request(app).delete('/admin/doctors/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Doctor not found');
    });

    test('Should create a schedule successfully', async () => {
        User.findByPk.mockResolvedValue({ id: 1, role: 'doctor' });
        Schedule.create.mockResolvedValue({ id: 1, doctorId: 1, date: '2025-02-13' });

        const res = await request(app)
            .post('/admin/doctors/1/schedules')
            .send({ date: '2025-02-13' });

        expect(res.status).toBe(200);
        expect(res.body.doctorId).toBe(1);
    });

    test('Should return 404 if schedule is not found', async () => {
        Schedule.findByPk.mockResolvedValue(null);

        const res = await request(app).delete('/admin/schedules/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Schedule not found');
    });

    test('Should return a list of doctors', async () => {
        User.findAll.mockResolvedValue([{ id: 1, email: 'doctor@example.com', role: 'doctor' }]);

        const res = await request(app).get('/admin/doctors');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].email).toBe('doctor@example.com');
    });
});

