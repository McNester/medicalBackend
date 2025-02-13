const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('../config/redis');

module.exports = {
    register: async (req, res) => {
        try {
            const user = await User.create(req.body);
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            res.json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ where: { email: req.body.email } });
            if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            const sessionToken = jwt.sign({ sessionId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
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
