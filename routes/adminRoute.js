const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("../config/config");
const auth = require("../middleware/adminAuth");

// ... (other imports)

admin_route.use(session({
    secret: config.sessionSecret,
    resave: 'false',
    saveUninitialized: true
}));

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const adminController = require('../controllers/adminController');

admin_route.get('/', auth.isLogout, adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/home', auth.isLogout, adminController.loadDashboard);
admin_route.get('/logout', adminController.logout);
admin_route.get('/dashboard', auth.isLogin, adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);
admin_route.post('/new-user',adminController.addUser);


// Update the route for editing users to use POST
admin_route.get('/edit-user',auth.isLogin, adminController.editUserLoad);
admin_route.post('/updateUser',auth.isLogin, adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser);



module.exports = admin_route;
