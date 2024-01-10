const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sign_up route handler

exports.signup= async( req,response ) =>{
    try {
        //input get data
        const {name, email, password,role}= req.body;
        //check if user already exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        //secure Password

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);   
        }
        catch(e){
            return response.status(500).json({
                success: false,
                message: "error hashing password"
            })
        }

        //create  user entry
        const user = await User.create({
            name,email,password:hashedPassword,role
        })
        return response.status(200).json({
            success: true,
            message: "User created successfully created",
        })
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            success: false,
            message:"user creation failed",
        })
    }
}


// login user route handler

exports.login = async (req, res) => {
    try {
        // data  fetch
        const {email, password} = req.body;
        // validate password and email

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "please fill all required fields",
            });
        }

        // user available or not

        const user = await User.findOne({email});
        //  if not registered

        if(!user){
            return res.status(401).json({
                success: false,
                message:"user is not registered",
            });
        }

        // verify password and generate JWT token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }

        if(await bcrypt.compare(password,user.password) ){
            // password is matched
            let token = jwt.sign(payload,
                                        process.env.JWT_SECRET,
                                        {
                                            expiresIn:"2h",
                                        });
                                        
            //token added in user object                           
            user.token = token;
            // remove password from user object 
            user.password = undefined;

            const options = {
                expires: new Date( Date.now()+ 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }



            res.cookie("token",token,options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in successfully",
            });
        }
        else{
            //password not match
            return res.status(403).json({
                success:false,
                message:"password doest match",
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Log in failed",
        })
    }
}