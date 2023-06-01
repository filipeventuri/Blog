const sequelize = require("sequelize");
const connection = require("../database/db");
const Article = require("../articles/Article");

const Category = connection.define('categories', {
    title:{
        type: sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: sequelize.STRING,
        allowNull:false

    }
})

Category.sync({force:false});
Article.belongsTo(Category);
Category.hasMany(Article);


module.exports = Category;