const User = require("../models/userModel");
const bcrypt = require('bcrypt');

const loadLogin = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message:"Email and Password is incorrect"});
                }
                else{
                    req.session.admin = userData._id;
                    res.redirect("/admin/dashboard");
                }
            }
            else{
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

const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try {
        if (req.session.admin) {
            req.session.admin=''
        }
        res.redirect('/admin/');
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req,res)=>{
    try {
        const usersData = await User.find({is_admin:0});
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message);
    }
}


const securePassword = async(password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}

// add new user



const newUserLoad = async(req,res)=>{
    try {
        res.render('new-user');
    } catch (error) {
        console.log(error.message);
    }
}


const addUser = async(req,res)=>{

    
    try {
        const present =await User.findOne({email:req.body.email})

        if (present) {
            res.render('new-user',{message:"Same user already exist"})
        } else {
            
        const name = req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const password = req.body.password;
        
        const spassword = await securePassword(password)

        const newUser = new User({
            name:name,
            email:email,
            mobile:mno,
            password:spassword,
            is_admin:0
        });

        const userData = await newUser.save();
         if(userData){
            res.redirect('/admin/dashboard')
         }
         else{
            res.render('new-user',{message:"something wrong"})
         }
        }
    } catch (error) {
        console.log(error.message);
    }
}

//edit user functionality

const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findOne({_id:id});
        if(userData){
            res.render('edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
};

//delete user

const deleteUser = async (req,res)=>{
    try { 
        
        const id = req.query.id;

        if (  req.session.user_id ==id) {
            req.session.user_id=''
        }
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message);
    }
}


module.exports ={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}