const jwt = require('jsonwebtoken');
const { User } = require('../models');
const redis = require('../config/redis');

module.exports = {
    authenticate: async (req, res, next) => {
        try {
            let token = req.cookies.jwt;
            let sessionToken = req.cookies.sessionToken;

            if (!token) {
                token = req.headers.authorization?.split(' ')[1];
            }

            if(!sessionToken){
                sessionToken = req.header('X-Session-Token');
            }

            if (!token || !sessionToken) return res.status(401).send('Access denied');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const decodedSesson = jwt.verify(sessionToken, process.env.JWT_SECRET);


            const storedSession = await redis.get(decoded.id.toString());
            if (!storedSession || storedSession !== sessionToken) {
                return res.status(401).json({ message: 'Session expired or invalid' });
            }

            req.user = await User.findByPk(decoded.id);
            next();
        } catch (error) {
            console.log(error)
            res.status(400).send('Invalid token');
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
        next();
    }
};
