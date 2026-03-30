const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const bcrypt =  require("bcrypt");
require("dotenv").config();

const register = async (req, res) =>{
    const {username, email, password, role="user"} = req.body
    try{
        const userExist = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        });

        if(!userExist){
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await userModel.create({
                username,
                email,
                password:hashedPassword,
                role
            })

            // generate token
            const token = jwt.sign({
                id: user._id,
                role:user.role
            }, process.env.JWT_SECRET)

            //token saved in cookie
            res.cookie("token", token)
            res.status(201).json({
                message:"User registered successfully!",
                user
            })

        }else{
            res.status(409).json({
                message: "User already exist"
            })
        }

    }catch(err){
        console.log(err);
        
        res.status(500).json({
            message: "Enternal server error"
        })
    }
}

const login = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        const user = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })

        if(!user){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }
        // compare hash password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign({
            id:user._id,
            role:user.role
        }, process.env.JWT_SECRET)
        
        res.cookie("token", token)

        res.status(200).json({
            message:"User logged in successfully",
            user: user
        })

    }catch(err){
        console.log(err);
        
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

module.exports = {register, login}