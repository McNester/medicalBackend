const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('../config/redis');
const crypto = require('crypto');

var nodemailer = require('nodemailer');
const { Op } = require('sequelize');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});

module.exports = {
    register: async (req, res) => {
        try {

            const existingUser = await User.findOne({ where: { email: req.body.email } });

            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }



            const user = await User.create(req.body);

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await user.update({
                verificationToken,
                tokenExpiresAt
            });


            const host = process.env.HOST

            const mailOptions = {
                from: process.env.MAIL,
                to: user.email,
                subject: 'Verify your email',
                html: `
                <h1>Email Verification</h1>
                <p>Please verify your email by clicking the link below:</p>
                <a href="http://${host}/auth/verify/${verificationToken}">Verify Email</a>
                <p>This link will expire in 10 minutes.</p>
                `
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.status(201).json({ 
                message: 'Registration successful. Please check your email to verify your account.',
                userId: user.id 
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    verify: async (req,res) => {

        try {
            const { token } = req.params;

            const user = await User.findOne({
                where: {
                    verificationToken: token,
                    tokenExpiresAt: { [Op.gt]: new Date() },
                    verified: false
                }
            });

            if (!user) {
                return res.status(400).json({ 
                    message: 'Invalid or expired verification link' 
                });
            }

            await user.update({
                verified: true,
                verificationToken: null,
                tokenExpiresAt: null
            });

            res.redirect('https://health-point-ten.vercel.app');

        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ message: 'Error during verification' });
        }

    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({ where: { email: req.body.email, verified: true  } });
            if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
                return res.status(401).json({ error: 'Invalid credentials or unverified' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            const sessionToken = jwt.sign({ sessionId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await redis.set(user.id.toString(), sessionToken);

            res.json({ token,sessionToken });
            res.cookie('jwt', token);
            res.cookie('sessionToken', sessionToken);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    logout: async(req,res) => {
        try{
            await redis.del(req.user.userId)
            res.json({ message: 'Logged out successfully' });

        }catch(error){
            res.status(400).json({ error: error.message });
        }
    }
};
