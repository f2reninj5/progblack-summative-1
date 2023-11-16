const { Sequelize, DataTypes, Op } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    dialect: 'mysql',
    logging: false
});

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING(16),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(32).BINARY,
        allowNull: false
    }
});

module.exports = {
    sequelize,
    User
};
