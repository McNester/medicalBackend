require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const { authenticate } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

db.sync({ alter: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

app.use('/auth', authRoutes);
app.use('/admin', authenticate, require('./middleware/auth').isAdmin, adminRoutes);
app.use('/doctor', authenticate, doctorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
