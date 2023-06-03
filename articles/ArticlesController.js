const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify")


router.get("/admin/articles", (req,res)=>{
    Article.findAll({ 
        include:[{model:Category}] //na busca de artigo estou incluindo os dados do tipo Category
    }).then(articles => {
        res.render("admin/articles/index", {articles:articles})
    })
   
})

router.get("/admin/articles/new", (req,res)=>{
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

module.exports = router;