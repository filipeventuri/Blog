const sequelize = require("sequelize");
const connection = require("../database/db");
const Category = require("../categories/Category");

const Article = connection.define("articles", {
    title:{
        type: sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: sequelize.STRING,
        allowNull:false
    },
    body:{
        type: sequelize.TEXT,
        allowNull:false
    }
    
})
Article.sync({force:false});




module.exports = Article;