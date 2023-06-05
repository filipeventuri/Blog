const express = require('express');
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs")

router.get("/admin/users/create", (req,res)=>{
    res.render("admin/users/create");
})

router.post("/users/create", (req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10); // NUMERO ALEATÓRIO PRA GERAR O SALT
    var hash= bcrypt.hashSync(password, salt);

    User.findOne({where:{email:email}}).then( user =>{
        if(user == undefined){
            User.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect("/");
            }).catch(()=>{
                res.redirect("/");
            })
        }else{
            res.redirect("/admin/users/create");
        }
    }
    )

    //acima está a forma correta de armazenar a senha de um usuário no banco de dados
})

router.get("/admin/users", (req,res)=>{
    User.findAll().then((users)=>{
        res.render("admin/users/index", {users:users});  
    })

})

router.post("/users/delete", (req,res)=>{
    var id = req.body.id;
    if(id!=undefined && id!=NaN){
        User.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect("/admin/users")
        })
    }else{
        res.redirect("/");
    }
})

router.get("/admin/users/edit/:id", (req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/users");
    }
    //acima esse if serve para previnir que o id seja sempre um número
    User.findByPk(id).then((user)=>{
        if(user!=undefined){
            res.render("admin/users/edit", {user:user});
        }else{
            res.redirect("/admin/users");
        }
    }).catch(()=>{
        res.redirect("/admin/users");
    })
})

router.post("/users/update", (req,res)=>{
    var id = req.body.id;
    var password = req.body.password;


    var salt = bcrypt.genSaltSync(10); // NUMERO ALEATÓRIO PRA GERAR O SALT
    var hash= bcrypt.hashSync(password, salt);

    User.update({password:hash},{where:{id:id}}).then(()=>{
        res.redirect("/admin/users");
    })
})


module.exports = router;