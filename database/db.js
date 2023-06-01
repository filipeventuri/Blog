const sequelize = require("sequelize");

const connection = new sequelize ('delta', 'root', '123', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection;