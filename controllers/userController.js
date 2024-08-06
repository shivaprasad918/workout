

const User = require('../models/userModel');

const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try {
        
       res.render('registration');

    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try {
        const presentk = await User.findOne({email:req.body.email})

if (presentk) {
    res.render('registration',{message:"User Already Exist."});
} else {
    

        const spassword = await securePassword(req.body.password);

        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            password:spassword,
            is_admin:0
        }); 

         await user.save();

         const userData = User.findOne({email:req.body.email})

        if(userData){
            res.render('registration',{message:"Your registration has been successfull."});
        }
        else{
            res.render('registration',{message:"Your registration has been failed"});
        }
    }
    } catch (error) {
        console.log(error.message);
    }
}

//login user methods started

const loginLoad = async(req,res)=>{
    try {
        if (req.session.user_id) {
            res.redirect('/home')
        } else {
            res.render('login');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {

        const email = req.body.email;
        const password = req.body.password;
        
        const userData = await User.findOne({email:email,is_admin:0});

        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                console.log(req.session.user_id);
                res.redirect('/home')
            } else {
                res.render('login',{message:"Email and Password is incorrect"});
            }
        }
        else{
            res.render('login',{message:"Email and Password is incorrect"});
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try {
        res.render('home');
    } catch (error) {
        console.log(error.message);
    }
}

const userLogout =async(req,res)=>{
    try {
        console.log(req.session.user_id);
        if (req.session.user_id) {
            
            req.session.user_id=''
    }
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}