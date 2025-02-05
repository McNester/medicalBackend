const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = db.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100]
        }
    },
    role: {
        type: DataTypes.ENUM('doctor','admin'),
        defaultValue: 'doctor'
    }
});


User.beforeValidate((user, options) => {
  if (user.role) delete user.role;
});

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;
