const express = require("express");
const router = express.Router();
const {body,validationResult} = require("express-validator")
const bcrypt = require("bcryptjs");
const userModel = require("../models/user")



router.get("/", (req, res) => {
  res.render("index");
});

router.get('/login', (req, res) => {
    res.render("login");
})

router.post("/login", 
    body('password').trim().isLength({min: 4}),
    body("username").trim().isLength({min: 3}),


    async (req,res)=>{
         const {username,password} = req.body;

         const existingUser = await userModel.findOne({ username })
         if(existingUser && await bcrypt.compare(password, existingUser.password)){
            req.session.user = existingUser;
            if(existingUser.isAdmin){
                return res.render('admindashboard', {user: existingUser});
            }else{
                return res.render('userdashboard');
            }
         }else{
            return res.render('login', {error: 'Invalid credentials'})
         }
    }
)

router.get('/admin-dashboard',(req,res)=>{
    if(req.session.user && req.session.user.isAdmin){
        res.render('admindashboard');
    } else{
        res.redirect('/login');
    }
})

router.get('/user-dashboard', (req,res)=>{
    if(req.session.user){
        res.render('userdashboard');
    } else{
        res.redirect('/login');
    }
})


router.get('/register', (req,res)=>{
    res.render('register');
})

router.post('/register',
    body("username").trim().isLength({ min: 3 }),
    body("password").trim().isLength({ min: 4 }),
     async (req,res)=>{
    const {username,password,isAdmin}= req.body;


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('register', {errors: errors.array()})
    }


    const existinguser = await userModel.findOne({username})
    if(existinguser){
        return res.render('register', {error: 'Username already exists'})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const isAdminBoolean = isAdmin === 'on' ? true : false;
    const newuser = new userModel({
        username,
        password: hashedPassword,
        isAdmin: isAdminBoolean,
    });
    try{
        await newuser.save();
        req.session.user = newuser;
        res.redirect('/login');
    }catch(err){
        console.log(err);
        res.status(500).send("Error Resgistering User")
    }
    
});
module.exports = router;
