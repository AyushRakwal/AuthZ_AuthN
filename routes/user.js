const express = require('express')
const router = express.Router();

const {login,signup}= require("../controlles/Auth");
const {auth , isAdmin , isStudent}= require("../middlewares/auth");

router.post('/login', login);
router.post('/signup', signup);


//testing routes
router.get('/test',auth,(req, res) => {
    res.json({
        success: true,
        message: 'Test successful',
    });
});

//protected routes

router.get('/student',auth,isStudent,(req,res)=>{
    res.json({
        success: true,
        message:"welcome to protected routes of student"
    });
});


router.get('/admin',auth,isAdmin,(req,res)=>{
    res.json({
        success: true,
        message:"welcome to protected routes of admin"
    })
});

module.exports = router;