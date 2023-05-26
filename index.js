const express = require('express');
const connection = require('./database/db');
const bodyParser = require('body-parser');
const categoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const Category = require("./categories/Category");
const Article = require("./articles/Article");

const app = express();


//config view engine e arquivos estáticos
app.set("view engine", "ejs");
app.set(express.static("public"));

//config bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connection.authenticate().then(()=>{
    console.log("Database acessed")
}).catch((err)=>{
    console.log("err: " + err);
})
//autenticando o banco de dados

app.use("/", categoriesController);
app.use("/", ArticlesController);
//quer dizer que app está usando as rotas que estão dentro de categoriesController e articlesController


app.get('/', (req,res)=>{
    res.render("index")
})

app.listen(8080, ()=>{
    console.log("Server running!")
})