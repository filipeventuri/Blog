const sequelize = require("sequelize");

const connection = new sequelize ('delta', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;