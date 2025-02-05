const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).send('Access denied');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      next();
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
    next();
  }
};
