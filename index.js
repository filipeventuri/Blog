const express = require('express');
const connection = require('./database/db');
const bodyParser = require('body-parser');
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const UserController = require("./users/UserController");
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./users/User");


const app = express();


//config view engine e arquivos estáticos
app.set("view engine", "ejs");
app.use(express.static("public"));

//config bodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connection.authenticate().then(()=>{
    console.log("Database acessed")
}).catch((err)=>{
    console.log("err: " + err);
})
//autenticando o banco de dados

app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UserController);
//quer dizer que app está usando as rotas que estão dentro de categoriesController e articlesController


app.get('/', (req,res)=>{
    Article.findAll({
        include: [{model:Category}],
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(articles=>{
        Category.findAll().then(categories=>{
            res.render("index", {articles:articles, categories:categories})
        })
        
    })
    
})

app.get('/:slug', (req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        include: [{model:Category}],
        where : {slug:slug}
    }).then(articles=>{
        if(articles!=undefined ){
            Category.findAll().then(categories=>{
                res.render("article", {articles:articles, categories:categories})
            })
        }else{
            res.redirect("/");
        }
    })
})

app.get('/categories/:slug', (req,res)=>{
    var slug = req.params.slug;
    Category.findAll().then(categories=>{
        Category.findOne({
            where: {slug:slug}
        }).then(categorie=>{
            Article.findAll({
                include: {model:Category},
                where: {categoryId:categorie.id}
            }).then(articles =>{
                res.render("admin/categories/articles", {articles:articles, categorie:categorie, categories:categories})
            })
        })
    })
    
})

app.listen(8080, ()=>{
    console.log("Server running!")
})