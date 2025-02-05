const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Schedule = db.define('Schedule', {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Schedule;
