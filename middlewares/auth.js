///auth , isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) =>{
    try {
        //extract token
        const token = req.header("Authorization").replace("Bearer ","") || req.body.token || req.cookie.token ;

        if(!token){
            return res.status(401).json({
                success: false,
                message:"token is required"
            });
        }

        // verify the token
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);

            req.user=decode;
        } catch(e){
            return res.status(401).json({
                success: false,
                message:"token is invalid",
            })
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message:"authentication failed",
        });
    }
}

// autherization for students
exports.isStudent = (req,res,next) =>{
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for student"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role not macthing"
        })
    }
}

//autherization for admin
exports.isAdmin = (req,res,next) =>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role not macthing"
        })
    }
}