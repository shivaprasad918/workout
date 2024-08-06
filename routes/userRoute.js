 const express = require("express");
 const path = require("path");
 const user_route = express();
 const userController = require("../controllers/userController");
 const auth = require("../middleware/auth");
 const session = require("express-session");
 const config = require("../config/config");
 const bodyParser = require('body-parser');
  
 user_route.set('view engine','ejs');
 user_route.set('views','./views/users');

 user_route.use(session({
    secret: config.sessionSecret,
    resave: 'false',  
    saveUninitialized: true 
}));

 user_route.use(bodyParser.json());
 user_route.use(bodyParser.urlencoded({extended:true}));




 user_route.get('/register',auth.isLogout,userController.loadRegister);

 user_route.post('/register',userController.insertUser);

 user_route.get('/',auth.isLogout,userController.loginLoad);

 user_route.get('/login',auth.isLogin,userController.loginLoad);
 user_route.post('/login',userController.verifyLogin);

 user_route.get('/home',auth.isLogin,userController.loadHome);

 user_route.get('/logout',userController.userLogout);

 module.exports = user_route;