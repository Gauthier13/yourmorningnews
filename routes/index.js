var express = require('express');
var router = express.Router();
var userModel = require('../models/users')
var bcrypt = require('bcrypt');
var uid2 = require('uid2');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// SIGN-UP
router.post('/sign-up', async (req,res) => {

  // on vérifie si les données issues des champs de saisies correspondent à un user dans la bdd
  var userExist = await userModel.findOne({
    firstname: req.body.firstname, 
    email: req.body.email, 
    password: req.body.password, 
    token: req.body.token,
    articles : []
  });

  var error = []; 
  const hash = bcrypt.hashSync(req.body.password, 10); // hash du mpd utilisateur avec 10 itérations

  // si le champ de saisie soumis est vide
  if(req.body.firstname == '' || req.body.email == '' ||  req.body.password == '') {
    error.push("Empty field..."); //message d'erreur

  }else if(userExist){

    error.push("Email already taken");

  } else {

    var newUser = new userModel({
      firstname : req.body.firstname,
      email : req.body.email,
      password : hash,
      token : uid2(32),
      articles : []
    });
  
    var userSave = await newUser.save();
    var token = userSave.token;

    var result = false;
    if(userSave){
      result = true;
    };
  };
  res.json({result, userSave, error, token});
})


// SIGN-IN
router.post('/sign-in', async (req,res) => {

  var error = []; 
  var pwd = req.body.password;
  var token = null;

    // si le champ de saisie soumis est vide
    if(req.body.email == '' ||  req.body.password == '') {

      error.push("Empty field..."); //message d'erreur
  
    } else {
      // si userDB n'est pas null, alors l'utilisateur est déjà enregistré 
      var userDB = await userModel.findOne({email: req.body.email}); 


      var result = false;
      if(userDB){
        if(bcrypt.compareSync(pwd, userDB.password)){ // comparaison champ de saisie et base de donnée
          token = userDB.token;
          result = true;
        } else {
          error.push("Incorrect email or password"); //message d'erreur 
        };
      };
    };
  res.json({result, userDB, error, token});
});


// SAVE un article en wishlist et en BDD 
router.post('/save-article', async (req,res) => {

  var userDB = await userModel.findOne({token : req.body.token}); // on identifie le bon utilisateur en BDD grâve à son token  
  var result = false;

  if(userDB != null && !userDB.articles.find(article => article.title === req.body.title)) { // le find filtre empêche l'ajout de doublon 
    userDB.articles.push({
      img : req.body.img,
      title : req.body.title,
      content : req.body.content,
      desc : req.body.desc
    });
    userDB.save();
    result = true;
  };
  res.json({userDB, result});
});


// DELETE un article de la wishlist et en BDD
router.delete('/delete-article', async (req,res) => {

  var user = await userModel.findOne({ token : req.body.tokenFromFront });

  user.articles = user.articles.filter((art) => art.title != req.body.title);

  user.save(); 

  res.json();
});


// IMPORT les articles sauvegardés en BDD pour les afficher dans la wishlsit un utilisateur 
router.get('/wishlist/:token', async (req,res) => {
  var result = false;
  var user = await userModel.findOne({ token : req.params.token });
  var articles = []; 
  console.log("user token "+ req.params.token);
  console.log("user: "+ user);

  // ajouter les articles de l'utilisateur dans l'array articles qui sera renvoyé au front
  if(user != null){
    userArticles = user.articles;
    result = true; 
    console.log('user article' + userArticles);
  };


  res.json({result, userArticles});
});

module.exports = router;
