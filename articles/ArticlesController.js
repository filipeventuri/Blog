const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles", adminAuth ,(req,res)=>{
    Article.findAll({ 
        include:[{model:Category}] //na busca de artigo estou incluindo os dados do tipo Category
    }).then(articles => {
        res.render("admin/articles/index", {articles:articles})
    })
   
})

router.get("/admin/articles/new", adminAuth ,(req,res)=>{
    Category.findAll().then(categories=>{
        res.render("admin/articles/new", {categories:categories});
    })

    
})

router.post("/articles/save", (req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;
    Article.create({
        categoryId: categoryId,
        title:title,
        slug:slugify(title),
        body:body
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", (req,res)=>{
    var id = req.body.id;
    if(id!=undefined && id!=NaN){
        Article.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/articles")
        })
    }else{
        res.redirect("/");
    }
})

router.get("/admin/articles/edit/:id", (req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/articles");
    }
    //acima esse if serve para previnir que o id seja sempre um número
    Article.findOne({
        include: {model:Category},
        where: {id:id}
    }).then((article)=>{
        if(article!=undefined){
        Category.findAll().then(categories=>{
            res.render("admin/articles/edit", {article:article, categories:categories});
        })
            
        }else{
            res.redirect("/admin/articles");
        }
    }).catch(()=>{
        res.redirect("/admin/articles");
    })
})

router.post("/articles/update", (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;

    Article.update({title:title,slug:slugify(title), body:body, categoryId:categoryId},{where:{id:id}}).then(()=>{
        res.redirect("/admin/articles");
    })
})

router.get("/articles/page/:num", (req,res)=>{
    var page = req.params.num;
    var offset = 0;
    
    if(isNaN(page) || page <= 1){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4;
    
    }
    
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles=>{
        
        var next = false;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories=>{
             res.render("admin/articles/page", {result:result, categories:categories})
        })
    })
    //esse método serve pra encontrar todos artigos e retornar a quantidade deles também
    // os "rows" seriam os dados e o "count" a quantidade  articles.rows articles.count
})

module.exports = router;